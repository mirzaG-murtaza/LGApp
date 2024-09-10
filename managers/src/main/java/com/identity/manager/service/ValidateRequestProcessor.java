package com.identity.manager.service;

import jakarta.servlet.http.HttpServletRequest;

public class ValidateRequestProcessor implements RequestProcessor {

    @Override
    public HttpServletRequest processRequest(HttpServletRequest request) {
        System.out.println(request + "request ----------------");
        return request;
    }
}
