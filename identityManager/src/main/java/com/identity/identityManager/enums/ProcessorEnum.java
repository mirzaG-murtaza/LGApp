package com.identity.identityManager.enums;

import com.identity.identityManager.service.HomeRequestProcessor;
import com.identity.identityManager.service.RequestProcessor;
import com.identity.identityManager.service.ValidateRequestProcessor;
import org.springframework.http.HttpMethod;

public enum ProcessorEnum {

    ValidateLead(HttpMethod.GET, "/auth/validateToken",new ValidateRequestProcessor()),
    HomeRequest(HttpMethod.GET, "/user/home",new HomeRequestProcessor());

    private final HttpMethod method;
    private final String uriRegex;
    private final RequestProcessor requestProcessor;



    ProcessorEnum(HttpMethod method, String uriRegex, RequestProcessor requestProcessor) {
        this.method = method;
        this.uriRegex = uriRegex;
        this.requestProcessor = requestProcessor;
    }

    public HttpMethod getMethod() {
        return method;
    }


    public String getUriRegex() {
        return uriRegex;
    }

    public RequestProcessor getRequestProcessor() {
        return requestProcessor;
    }
}
