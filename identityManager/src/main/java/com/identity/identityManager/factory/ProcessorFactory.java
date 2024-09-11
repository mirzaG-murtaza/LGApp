package com.identity.identityManager.factory;

import com.identity.identityManager.enums.ProcessorEnum;
import com.identity.identityManager.service.RequestProcessor;

import java.util.Arrays;
import java.util.Optional;

public class ProcessorFactory {
    public static RequestProcessor getProcessor(String method, String path) throws Exception {

        Optional<ProcessorEnum> processorEnum = Arrays.stream(ProcessorEnum.values()).filter(x ->
                x.getMethod().toString().equalsIgnoreCase(method) && path.matches(x.getUriRegex())
        ).findFirst();

        if(processorEnum.isEmpty()){
            throw new Exception(method+ "  " +path + " NOT FOUND");
        }

        return processorEnum.get().getRequestProcessor();

    }
}