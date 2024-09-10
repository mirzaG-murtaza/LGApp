package org.report.utils;

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


        mongoFieldMap.put("'Description'",	"'$propertyDescription'");
        mongoFieldMap.put("'Annual Tax'",	"'$tax.latestYearAssessmentTaxes.totalTax'");
        mongoFieldMap.put("'Tax Assd Value'",	"'$tax.latestYearAssessmentTaxes.assessedValueTotal'");
        mongoFieldMap.put("'DOMTS'",	"'$DOMTS'");
        mongoFieldMap.put("'Sold Price'",	"'$soldPrice'");
        mongoFieldMap.put("'Sold Date'",	"'$soldDate'");
        mongoFieldMap.put("'Listed $/Sq Ft'",	"'$lstSqFt'");
        mongoFieldMap.put("'Sold $/Sq. Ft'",	"'$lstSqFt'");
        mongoFieldMap.put("'DOMPTS'",	"'$DOMPTS'");
        mongoFieldMap.put("'Remarks'",	"'$privateRemarks'");
        mongoFieldMap.put("'Keywords'",	"'$Keywords dcoument link '");
        mongoFieldMap.put("'Listing Officer'",	"'$lo'");
        mongoFieldMap.put("'Listing Agent'",	"'$la'");
        mongoFieldMap.put("'ISD'",	"'$schoolDist'");
        mongoFieldMap.put("'Cooling Type'",	"'$tax.characteristics.Cooling Type'");
        mongoFieldMap.put("'Heating Type'",	"'$tax.characteristics.Heating Type'");
        mongoFieldMap.put("'Aslo4Lease'",	"'$alsoForLease'");
        mongoFieldMap.put("'Bed'",	"'$bedrooms'");
        mongoFieldMap.put("'CDOM'",	"'$cdom'");
        mongoFieldMap.put("'City'",	"'$city'");
        mongoFieldMap.put("'County'",	"'$county'");
        mongoFieldMap.put("'DOM'",	"'$dom'");
        mongoFieldMap.put("'Foundation'",	"'$foundation'");
        mongoFieldMap.put("'Full Baths'",	"'$fullBaths'");
        mongoFieldMap.put("'Garage Space'",	"'$garSpaces'");
        mongoFieldMap.put("'Half Baths'",	"'$halfBaths'");
        mongoFieldMap.put("'Type'",	"'$housingType'");
        mongoFieldMap.put("'Conf. Score'",	"'$tax.latestEstimatedTaxMap.confidenceScore'");
        mongoFieldMap.put("'MLS AVM Low'",	"'$tax.latestEstimatedTaxMap.estimatedValueRangeLow'");
        mongoFieldMap.put("'Forecast SD'",	"'$tax.latestEstimatedTaxMap.forecastStandardDeviation'");
        mongoFieldMap.put("'MLS AVM'",	"'$tax.latestEstimatedTaxMap.realAVMO'");
        mongoFieldMap.put("'MLS AVM High'",	"'$tax.latestEstimatedTaxMap.estimatedValueRangeHigh'");
        mongoFieldMap.put("'Listing Price'",	"'$latestLP'");
        mongoFieldMap.put("'Buyer Name'",	"'$history.latestSaleHistoryFromPublicRecords.buyerNameS'");
        mongoFieldMap.put("'Seller Name'",	"'$history.latestSaleHistoryFromPublicRecords.sellerNameS'");
        mongoFieldMap.put("'Status'",	"'$latestStatus'");
        mongoFieldMap.put("'Price/Sq. Ft'",	"'$lstSqFt'");
        mongoFieldMap.put("'Orig. LP'",	"'$origLP'");
        mongoFieldMap.put("'Pool'",	"'$pool'");
        mongoFieldMap.put("'Private Rmks'",	"'$privateRemarks'");
        mongoFieldMap.put("'Redfn Estimate'",	"'$redFinEstimate.estimate'");
        mongoFieldMap.put("'Sq Feet'",	"'$sqFt'");
        mongoFieldMap.put("'Stories'",	"'$stories'");
        mongoFieldMap.put("'Exemptions'",	"'$tax.exemptions'");
        mongoFieldMap.put("'Bath'",	"'$totBaths'");
        mongoFieldMap.put("'Zip Code'",	"'$zipcode'");

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
