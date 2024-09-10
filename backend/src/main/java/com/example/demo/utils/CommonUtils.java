package com.example.demo.utils;

import com.example.demo.models.FormulaObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import static com.example.demo.utils.Constants.*;


@Component
public class CommonUtils {

    private static final Logger logger = LogManager.getLogger(CommonUtils.class);


    @Autowired
    ObjectMapper mapper;


    public File writeExtractObjectToFile(String filename, Object obj) throws IOException {
        try{
            File file = new File(filename);
            mapper.writeValue(new File(filename), obj);
            logger.info("Successfully wrote to the file.");
            return file;
        }catch (IOException ex){
            logger.error("exception occured while writing to file ",ex);
            throw ex;
        }
    }

    public String getDateAsString(){

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }

    public Double parseCurrencyTextToDouble(String parseDouble) {
        if(StringUtils.isEmpty(parseDouble)){
            return null;
        }
        try {
            return Double.parseDouble(parseDouble.replaceAll("(\\$|,)", ""));
        }catch (Exception ex){
            logger.error("Unable to parse the value as double " + parseDouble +"\n\n\n"+ ex.getMessage());
        }
        return null;
    }

    public LocalDateTime parseStringToLocalDateTime(String text) {
        try {
            if(text.length()==21){
                return  LocalDateTime.parse(text , DateTimeFormatter.ofPattern("MM/dd/yyyy h:mm:ss a"));
            }else{
                return  LocalDateTime.parse(text , DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm:ss a"));
            }

        }catch (Exception exception){
            logger.error("error occurred while parsing dateTime string. ", exception);
            return null;
        }
    }

    public LocalDateTime parseDBStringToLocalDateTime(String text) {
        try {
            return  LocalDateTime.parse(text , DateTimeFormatter.ofPattern("MM-dd-yyyy'T'HH:mm:ss"));
        }catch (Exception exception){
            logger.error("error occurred while parsing dateTime string. ", exception);
            return null;
        }
    }


    public Pair<String,Integer>  parseCrunch360Formula(char[] array,Integer i ,Character parseTill) throws Exception {

        Node initialNode = new Node("");
        Node node = initialNode;
        while(parseTill!=array[i]){


            if(operatorMap.containsKey(array[i])){
                String operator = operatorMap.get(array[i]);
                if(functionalOperators.containsKey(operator)){
                    Pair<String,Integer> operand = parseFunctionalOperator(array,i,operator);
                    node.setNext(new Node(operand.getKey()));
                    node.getNext().setPrevious(node);
                    node = node.getNext();
                    i=operand.getValue();
                }
                else {
                    if((array[i]=='>'||array[i]=='<')&&array[i+1]=='='){
                        operator+="=";
                    }
                    i+=operator.length();
                    node.setNext(new Node(operator));
                    node.getNext().setPrevious(node);
                    node = node.getNext();
                }
            }

            else if(array[i]=='('){
                Pair<String,Integer> bracketResolved= parseCrunch360Formula(array,i+1,')');
                node.setNext(new Node(bracketResolved.getKey()));
                node.getNext().setPrevious(node);
                node = node.getNext();
                i=bracketResolved.getValue();
            }
            else if(array[i]=='\''||(array[i]>='0'&&array[i]<='9')) {
                Pair<String,Integer> operand= parseOperand(array,i);
                node.setNext(new Node(operand.getKey()));
                node.getNext().setPrevious(node);
                node = node.getNext();
                i=operand.getValue();
            }
            else{
                i++;//ignoring non expression empty space
            }
        }

        //removing first empty node
        initialNode.getNext().setPrevious(null);
        initialNode = initialNode.getNext();

        return  new Pair(resolveExpressionPrecedenceWise(initialNode),i);
    }

    private String resolveExpressionPrecedenceWise(Node node) throws Exception {

        Node intialNode = node;

        for (String precedence:
                PRECEDENCE) {
            while(node.getNext()!=null){
                if(precedence.equalsIgnoreCase(node.getData())){
                    node.setData(resolveOperationExpression(node.getData(),node.getPrevious().getData(),node.getNext().getData()));
                    node.setNext(node.getNext().getNext());
                    node.setPrevious(node.getPrevious().getPrevious());
                    if(node.getPrevious()!=null) {
                        node.getPrevious().setNext(node);
                    }
                    else{
                        node.setPrevious(null);
                        intialNode = node;
                    }
                    if(node.getNext()!=null) {
                        node.getNext().setPrevious(node);
                    }
                }
                if(node.getNext()!=null) {
                    node = node.getNext();
                }
            }
            node=intialNode;
        }

        return node.getData();

    }

    private String resolveOperationExpression(String operator, String operand1, String operand2) throws Exception {

        if(!operatorMongoResolution.containsKey(operator)){
            throw new Exception("Invalid Expression");
        }
        return operatorMongoResolution.get(operator)+ operand1 + ","+operand2+"]}";

    }

    private Pair<String,Integer> parseOperand(char[] array,Integer i ) throws Exception {

        Pair<String,Integer> field = null;
        if(array[i]=='\''){

            Pair<String,Integer> operand = parseString(array,i);
            if(mongoFieldMap.containsKey(operand.getKey())){
                return new Pair<>(mongoFieldMap.get(operand.getKey()),operand.getValue());
            }
            return operand;
        }
        else if(array[i]>='0'&&array[i]<='9'){
            return parseNumber(array,i); //May contain decimal value //
        }

        else{
            throw new Exception("Invalid Expression");
        }
    }


    private Pair<String,Integer> parseNumber(char[] array, Integer i) {

        StringBuilder operand = new StringBuilder();
        while(array[i]>='0'&&array[i]<='9'){
            operand.append(array[i]);i++;
            if(array[i]=='.') {
                operand.append(array[i]);
                i++;
            }
        }

        if(array[i]=='%') {
            return new Pair<>(""+(Double.parseDouble(operand.toString())*0.01),i+1);
        }
        return  new Pair<>(operand.toString(),i);

    }

    private Integer skipCharactersTill(char[] array, Integer i , char till ){

        while(array[i]!=till){
            i++;
        }
        return i;
    }

    private Pair<String, Integer> parseFunctionalOperator(char[] array, Integer i,String operator) throws Exception {

        //skipping '(' and spaces before and after bracket open till operand
        i=  skipCharactersTill(array,i + operator.length(),'\'');

        if(functionalOperators.get(operator).equalsIgnoreCase("OpKeyOp")){

            Pair<String,Integer> field = parseOperand(array,i);
            i= field.getValue();
            //skipping ',' and spaces before and after bracket open till operand
            i = skipCharactersTill(array,i,'\'') ;
            Pair<String,Integer> value = parseOperand(array,i);

            i= value.getValue();
            i = skipCharactersTill(array,i,')') +1 ; //skipping leading spaces and then skipping ')' with + 1

            if(operator.equalsIgnoreCase("Contain")) {
                return new Pair(operatorMongoResolution.get(operator) + field.getKey()
                        + ", regex : " + value.getKey() + " , options: 'i'}}", i);
            } else {
                return new Pair(operatorMongoResolution.get(operator) + field.getKey()
                        + ", regex : " + value.getKey() + " , options: 'i'}}}", i);
            }
        }
        else if (functionalOperators.get(operator).equalsIgnoreCase("OpKey")) {

            Pair<String, Integer> value = parseOperand(array, i);
            i= value.getValue();
            i = skipCharactersTill(array,i,')') +1 ; //skipping leading spaces and then skipping ')' with + 1

            return new Pair("{" + value.getKey() + operatorMongoResolution.get(operator), i);

        }
        else {
            Pair<String, Integer> value = parseOperand(array, i);
            i= value.getValue();
            String field = value.getKey();
            String format ="'%m-%d-%YT%H:%M:%S'";
            if(seekNextNonSpaceFromI(array,i)==','){ //format is in request
                i = skipCharactersTill(array,i,'\'') ;
                value = parseOperand(array, i);
                format = value.getKey();
                i = value.getValue();
            }
            i = skipCharactersTill(array,i,')') +1 ; //skipping leading spaces and then skipping ')' with + 1


            return new Pair(operatorMongoResolution.get(operator)+format+
                    operatorMongoResolution.get("DaysPart2")+
                    field+operatorMongoResolution.get("DaysPart3"), i);

        }


    }

    private Character seekNextNonSpaceFromI(char[] array, Integer i){

        while(array[i]==' '){
            i++;
        }

        return array[i];

    }
    private Pair<String, Integer> parseString(char[] array, Integer i) {

        StringBuilder operand = new StringBuilder("'");
        i++;
        while(array[i]!='\''){
            operand.append(array[i]);i++;
        }

        operand.append(array[i]);i++;

        if(mongoFieldMap.containsKey(operand.toString())) { //with single quotes
            return new Pair<>(mongoFieldMap.get(operand.toString()), i);
        }

        return new Pair<>(operand.toString(), i);

    }

    public List<Document> crunchReport(String formulaObjectString) throws Exception {
        return crunchReport(mapper.readValue(formulaObjectString, FormulaObject.class));
    }

    public List<Document> crunchReport(FormulaObject formulaObject) throws Exception {


        List<Document> aggregatePipeline = new ArrayList<>();

        int i =0;

        List<String> skipProjectionFields= new ArrayList<>();
        Map<String,String> matchCriteria= new HashMap<>();

        boolean actHistoryFieldAdded = false;

        List<Document> frqAggregatePipeline = new ArrayList<>();

//        if(formulaObject.getAdditionalFilters()!=null) {
//            for (AdditionalFilter additionalFilter : formulaObject.getAdditionalFilters()) {
//
//                i++;
//                if (additionalFilter.getType().contains("frequency")) {
//
//                    String field = mongoFieldMap.get(additionalFilter.getOperands().get(0));
//
//                    if (field == null) {
//                        field = additionalFilter.getOperands().get(0);
//                    }
//
//                    frqAggregatePipeline.add(Document.parse("{'$group' : {'_id'" + ":" +
//                            field + ", result:{$sum:1}}}"));
//
//
//                    frqAggregatePipeline.add(Document.parse("{'$match':{'$expr': { '$gte':['$result',"
//                            + additionalFilter.getOperands().get(1) + "] }}}"));
//
//
//                } else if (additionalFilter.getType().contains("status")) {
//
//                    if (!actHistoryFieldAdded) {
//                        aggregatePipeline.add(Document.parse("  { '$addFields': {" +
//                                "    'activeHistory': { " +
//                                "        $first:{" +
//                                "            '$filter': {" +
//                                "              'input': '$history.listingHistory'," +
//                                "              'as': 'part'," +
//                                "              'cond': { '$eq': ['$$part.mls', '$_id']}" +
//                                "                }" +
//                                "            }" +
//                                "        }" +
//                                "    }" +
//                                "}"));
//                        actHistoryFieldAdded = true;
//                        skipProjectionFields.add("'activeHistory':0");
//
//                    }
//
//
//                    String fieldName = "activeCount" + i;
//                    aggregatePipeline.add(Document.parse("{" +
//                            "  '$addFields': {" +
//                            "    '" + fieldName + "': {" +
//                            "      '$filter': {" +
//                            "        'input': '$activeHistory.statusHistory.newValue'," +
//                            "        'as': 'part'," +
//                            "        'cond': {" +
//                            "          '$or':[" +
//                            "          {'$eq': [" +
//                            "            '$$part'," +
//                            "            '" + AggregateStatus.valueOf(additionalFilter.getOperands().get(0)).getValue() + "'" +
//                            "          ]}" +
//                            "          ,{'$eq': [" +
//                            "            '$$part'," +
//                            "            '" + AggregateStatus.valueOf(additionalFilter.getOperands().get(0)).getNewValue() + "'" +
//                            "          ]}]" +
//                            "        }" +
//                            "      }" +
//                            "    }" +
//                            "  }" +
//                            "}"));
//
//
//                    matchCriteria.put("$" + additionalFilter.getOperator(), "{ $and:[{'" + fieldName + ".0':{$exists:true}} " +
//                            ", {'$expr':{$gte:[{$size:'$" + fieldName + "'},"+
//                            (additionalFilter.getOperands().size()>1?additionalFilter.getOperands().get(1):2)+"]}}]}");
//
//                    skipProjectionFields.add("'" + fieldName + "':0");
//                }
//            }
//        }

        aggregatePipeline.add(Document.parse("{'$match':"+createMatchCriteria(matchCriteria, "{ $expr:  "
                +parseCrunch360Formula(formulaObject.getExpr())+"}")+"}"));

//        if(frqAggregatePipeline.isEmpty()&&!skipProjectionFields.isEmpty()) {
//            String skipProjectionExpression = "{$project:{" + skipProjectionFields.toString().replaceAll("\\[|\\]", "") + "}}";
//            aggregatePipeline.add(Document.parse(skipProjectionExpression));
//        }
//        else if(!frqAggregatePipeline.isEmpty()){
//            frqAggregatePipeline.forEach(x->aggregatePipeline.add(x));
        String skipProjectionExpression = "{'$project': { '_id':0, 'field': '$_id', 'frequency': '$result'}}";
        aggregatePipeline.add(Document.parse(skipProjectionExpression));
        aggregatePipeline.add(Document.parse(" { '$sort' : { 'frequency':-1} }"));
//        }

        aggregatePipeline.forEach(x->System.out.println(","+x.toJson()));

        return aggregatePipeline;

    }

    private String createMatchCriteria(Map<String, String> matchCriteria, String expr) {

        AtomicReference<StringBuilder> match = new AtomicReference<>(new StringBuilder(expr));
        matchCriteria.keySet().forEach(x->{
            match.set(new StringBuilder("{" + x + ": [ " + match.get() + " , " + matchCriteria.get(x) + "]}"));
        });

        return match.toString();

    }

    private String parseCrunch360Formula(String value) throws Exception {
        return parseCrunch360Formula((value+"\0").toCharArray(),0,'\0').getKey();
    }

    public Integer parseIntegerCustom(String text) {
        try {
            return Integer.parseInt(text.trim());
        }catch (Exception ex){
            logger.error("Exception while parsing "+text);
        }
        return null;
    }

    public String formatDate(LocalDateTime date, DateTimeFormatter isoDateTime) {

        if(date==null){
            return null;
        }
        try {
            return date.format(isoDateTime);
        }catch (Exception ex){
            logger.error("Exception occurred while formatting. " ,ex);
            return null;
        }
    }


    private String populateFieldsInString(String string,Map<String,Object> map){

        String str = string;
        for(String key : map.keySet()){
            if(map.get(key)!=null){
                str = str.replace("["+key+"]",map.get(key).toString());
            }else{
                str = str.replace("["+key+"]","");
            }
        }
        return str;

    }

    private String loadResource(Resource resource) throws IOException {
        InputStream inputStream = resource.getInputStream();

        String var3;
        try {
            var3 = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
        } catch (Throwable var6) {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (Throwable var5) {
                    var6.addSuppressed(var5);
                }
            }

            throw var6;
        }

        if (inputStream != null) {
            inputStream.close();
        }

        return var3;
    }
}
