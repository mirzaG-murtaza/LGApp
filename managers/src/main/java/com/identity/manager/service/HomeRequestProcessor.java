package com.identity.manager.service;

import jakarta.servlet.http.HttpServletRequest;

public class HomeRequestProcessor implements RequestProcessor{
    @Override
    public HttpServletRequest processRequest(HttpServletRequest request) {
        System.out.println(request + "request ----------------");
        return request;
    }
}
