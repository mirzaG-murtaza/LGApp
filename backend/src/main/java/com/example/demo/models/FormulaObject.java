package com.example.demo.utils;


import java.util.List;

public class FormulaObject {

    private String expr;
    private List<AdditionalFilter> additionalFilters;

    public FormulaObject() {
    }

    public String getExpr() {
        return expr;
    }

    public void setExpr(String expr) {
        this.expr = expr;
    }

    public List<AdditionalFilter> getAdditionalFilters() {
        return additionalFilters;
    }

    public void setAdditionalFilters(List<AdditionalFilter> additionalFilters) {
        this.additionalFilters = additionalFilters;
    }

    public FormulaObject(String expr, List<AdditionalFilter> additionalFilters) {
        this.expr = expr;
        this.additionalFilters = additionalFilters;
    }
}
