package com.example.demo.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdditionalFilter {
    private String type; //frequency , status
    private String operator; //'and' or 'or'
    private List<String> operands; //frequency=> field name, number of times
    //status=> statusValue
}