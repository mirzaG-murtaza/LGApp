package com.example.demo.utils;

import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Constants {


    public static final String DATETIME_FORMAT = "dd-MM-yyyy HH:mm";
    public static final LocalDateTime FIXED_DATE = LocalDateTime.now();
    public static LocalDateTimeSerializer LOCAL_DATETIME_SERIALIZER = new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DATETIME_FORMAT));

    public static final Map<Character,String> operatorMap= new HashMap<>();
    public static final Map<String,String> operatorMongoResolution = new HashMap<>();
    public static final Map<String,String> functionalOperators = new HashMap<>();
    public static final Map<String,String> mongoFieldMap = new HashMap<>();
    public static final List<String> PRECEDENCE = new ArrayList<>();

    static {
        operatorMap.put('+',"+");
        operatorMap.put('-',"-");
        operatorMap.put('/',"/");
        operatorMap.put('*',"*");
        operatorMap.put('%',"%");
//        operatorMap.put('(',"("); removing brackets since they are not being treated as operators
//        operatorMap.put(')',")");

        operatorMap.put('a',"and");
        operatorMap.put('o',"or");
        operatorMap.put('=',"=");
        operatorMap.put('<',"<=");
        operatorMap.put('>',">=");
        operatorMap.put('>',">");
        operatorMap.put('<',"<");
        operatorMap.put('!',"!=");

        operatorMap.put('D',"Days");
        operatorMap.put('C',"Contain");
        operatorMap.put('N',"NotContain");
        operatorMap.put('I',"IsNull");
        operatorMap.put('H',"HasValue");



        ///////// ARITHEMATIC AND LOGICAL OPERATORS FOR COMPLICATED EXPRESSIONS ///////////

        //**************
         //get(key) + op1+","+op2 + "]}"
        operatorMongoResolution.put("+","{$add : ["); // {$add : [op1,op2]"
        operatorMongoResolution.put("-","{$subtract:[");
        operatorMongoResolution.put("/","{$divide:[");
        operatorMongoResolution.put("*","{$multiply:[");
        operatorMongoResolution.put("and","{$and:[");
        operatorMongoResolution.put("or","{$or:[");
        operatorMongoResolution.put("<","{$lt:[");
        operatorMongoResolution.put(">","{$gt:[");
        operatorMongoResolution.put(">=","{$gte:[");
        operatorMongoResolution.put("<=","{$lte:[");
        operatorMongoResolution.put("="," {$eq: [  "); //{op1 : op2}
        operatorMongoResolution.put("!="," {$ne :[ ");



        //"{"+ op1 + get(key)+ op2 + "}}"
        // {  op1: {$ne : op2 }}

        ///////// % and BRACKETS HAVE SEPARATE FLOW EVALUATED AS OPERAND YIELD ///////////

        operatorMongoResolution.put("%","//part of the numeric discovery");
        operatorMongoResolution.put("(","//part of the bracket resolution");
        operatorMongoResolution.put(")","//part of the bracket resolution");



        ///////// SINGLE FIELD EXPRESSIONS EVALUATED AT OPERATOR LEVEL ///////////

        //if number check number + 1 if ==% multiply it by 0.01 and then push

        //{'$regexMatch':{input:FIELD, regex: VALUE , options : 'i'}}
        // key + op1 + " , regex: "+op2+ " option: 'i'}"
        operatorMongoResolution.put("Contain","{'$regexMatch': {input: "); //Contain('FieldName','text'); {op1:{$regex: '*op2*'}}
        operatorMongoResolution.put("NotContain","{$not : {'$regexMatch': {input:  "); //NotContain('FieldName','text'); {op1: {$not : {$regex: '*op2*'}}}

        functionalOperators.put("Contain","OpKeyOp");
        functionalOperators.put("NotContain","OpKeyOp");
        //CategoryB

        //*****************
        //"{"+ op1 + get(key)
        operatorMongoResolution.put("IsNull",": { $exists:false}}"); // or { fieldName : { $exists:true}}
        operatorMongoResolution.put("HasValue",": { $exists:true}}"); // or { fieldName : { $exists:true}}
        functionalOperators.put("IsNull","OpKey");
        functionalOperators.put("HasValue","OpKey");
        //CategoryC

        //get("Days")+fieldName+get("DaysPart2")
        operatorMongoResolution.put("Days","{$dateDiff: {  startDate : { $dateFromString: { format: " );
        operatorMongoResolution.put("DaysPart2"," , dateString: ");


        operatorMongoResolution.put("DaysPart3"," } },  endDate : '$$NOW', unit : 'day'}}");

        functionalOperators.put("Days","Computation");


        mongoFieldMap.put("'Company Name'", "'$companyName'");
        mongoFieldMap.put("'Inviter Name'", "'$inviterName'");
        mongoFieldMap.put("'Tech Stack'", "'$techStackName'");
        mongoFieldMap.put("'BD Name'", "'$bdName'");
        mongoFieldMap.put("'Dev Name'", "'$devName'");
        mongoFieldMap.put("'Profile Name'", "'$profileName'");
        mongoFieldMap.put("'Coordinator Name'", "'$coordinatorName'");
        mongoFieldMap.put("'Status'", "'$status'");
        mongoFieldMap.put("'Description'", "'$description'");
        mongoFieldMap.put("'First Contact Date'", "'$firstContactDate'");
        mongoFieldMap.put("'Call Date'", "'$callSchedules.callDate'");
        mongoFieldMap.put("'Call Notes'", "'$callSchedules.notes'");
        mongoFieldMap.put("'Lead Company Name'", "'$callSchedules.leadCompanyName'");
        mongoFieldMap.put("'Call Category'", "'$callSchedules.callCategory'");
        mongoFieldMap.put("'Followup Date'", "'$callSchedules.followUps.followupDate'");
        mongoFieldMap.put("'Followup Notes'", "'$callSchedules.followUps.callNotes'");
        mongoFieldMap.put("'Followup Status'", "'$callSchedules.followUps.status'");
        mongoFieldMap.put("'User ID'", "'$userId'");





        PRECEDENCE.add("*");
        PRECEDENCE.add("/");
        PRECEDENCE.add("+");
        PRECEDENCE.add("-");
        PRECEDENCE.add("<");
        PRECEDENCE.add("<=");
        PRECEDENCE.add(">");
        PRECEDENCE.add(">=");
        PRECEDENCE.add("=");
        PRECEDENCE.add("!=");
        PRECEDENCE.add("and");
        PRECEDENCE.add("or");
    }


}
