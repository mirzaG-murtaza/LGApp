package com.identity.manager.service;

import jakarta.servlet.http.HttpServletRequest;

public interface RequestProcessor {
    HttpServletRequest processRequest( HttpServletRequest request);
}
