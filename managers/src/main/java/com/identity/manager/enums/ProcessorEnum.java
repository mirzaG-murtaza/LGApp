package com.identity.manager.enums;

import com.identity.manager.service.HomeRequestProcessor;
import com.identity.manager.service.RequestProcessor;
import com.identity.manager.service.ValidateRequestProcessor;
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
