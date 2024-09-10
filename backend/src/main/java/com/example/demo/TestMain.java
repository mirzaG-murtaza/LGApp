package com.example.demo;


import com.example.demo.models.FormulaObject;
import com.example.demo.utils.CommonUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.bson.Document;

import java.util.List;

@SpringBootApplication
public class TestMain {
    public static void main(String[] args) throws Exception {
        try {
            CommonUtils commonUtils = new CommonUtils();

            FormulaObject obj = new FormulaObject();
            obj.setExpr(" Contain ('$candidate', 'Haider') and ( 'BD' = 10 or 'BD' = 20)");
            List<Document> pipeline = commonUtils.crunchReport(obj);

            pipeline.forEach(x->System.out.println(","+x.toJson()));


        }catch (Exception e){
            e.printStackTrace();
            return;
        }

        ConfigurableApplicationContext context = SpringApplication.run(TestMain.class, args);



    }


}







