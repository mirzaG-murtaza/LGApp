package com.example.demo.controller;

import com.example.demo.entity.FilterString;
import com.example.demo.entity.Leads;
import com.example.demo.models.FormulaObject;
import com.example.demo.repository.LeadsRepository;
import com.example.demo.utils.CommonUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadsController {

    @Autowired
    private LeadsRepository leadsRepository;

    @Autowired
    private CommonUtils commonUtils;


    @Autowired
    private RestTemplate restTemplate;

    @Value("${validation.uri}")
    private String validationUri;

    private static final Logger logger = LoggerFactory.getLogger(LeadsController.class);

    private Map<String, Object> validateToken(String token) {
        String validationUrl = "http://" + validationUri + ":8081/auth/validateToken";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        logger.info("HTTP Entity created: {}", entity);

        try {
            logger.info("Making HTTP GET request to: {}", validationUrl);
            ResponseEntity<Map> response = restTemplate.exchange(
                    validationUrl,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                logger.info("Response body after successful status check: {}", responseBody);
                if (responseBody != null && "success".equals(responseBody.get("status"))) {
                    logger.info("Token validation succeeded for user: {}", responseBody.get("user"));
                    return (Map<String, Object>) responseBody.get("user");
                }
            } else {
                logger.warn("Received non-OK response status: {}", response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            logger.error("HTTPClientErrorException during token validation: {}", e.getResponseBodyAsString());
            logger.error("HTTPClientErrorException details: ", e);
        } catch (RestClientException e) {
            logger.error("RestClientException during token validation", e);
        } catch (Exception e) {
            logger.error("Unexpected error during token validation", e);
        }

        logger.warn("Token validation failed, returning null");
        return null;
    }


    private boolean hasPermission(Map<String, Object> userDetails, String permission) {
        List<String> permissions = (List<String>) userDetails.get("permissions");
        return permissions != null && permissions.contains(permission);
    }

    @GetMapping("/{leadsId}")
    public ResponseEntity<Leads> getLeadsById(
            @PathVariable String leadsId,
            @RequestHeader("Authorization") String token) {

        Map<String, Object> userDetails = validateToken(token);
        if (userDetails == null || !hasPermission(userDetails, "READ:LEAD")) {
            logger.warn("Unauthorized access attempt with token: {}", token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<Leads> leads = leadsRepository.findById(leadsId);

        if (leads.isPresent()) {
            logger.info("Leads found: {}", leads.get());
            return ResponseEntity.ok(leads.get());
        } else {
            logger.warn("Leads not found with ID: {}", leadsId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Leads> createLeads(
            @RequestBody Leads leads,
            @RequestHeader("Authorization") String token) {

        logger.info("HTTP POST request received to create a new leads");
        logger.info("Authorization header: {}", token);
        logger.info("Request Body: {}", leads);

        Map<String, Object> userDetails = validateToken(token);
        if (userDetails == null || !hasPermission(userDetails, "WRITE:LEAD")) {
            logger.warn("Unauthorized access attempt to create leads with token: {}", token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        leads.setId(null);
        Leads savedLeads = leadsRepository.save(leads);
        logger.info("Leads created with ID: {}", savedLeads.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLeads);
    }


    @PostMapping("/filter")
    public ResponseEntity<List<Document>> filter(
            @RequestBody FilterString filterString,
            @RequestHeader("Authorization") String token
    ) {
//        TODO: comment the below condition to bypass the validation during the development
        Map<String, Object> userDetails = validateToken(token);
        if (userDetails == null || !hasPermission(userDetails, "READ:LEAD")) {
            logger.warn("Unauthorized access attempt to create leads with token: {}", token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        FormulaObject obj = new FormulaObject();
        String finalString = filterString.getFilterString();

        obj.setExpr(finalString);
        System.out.println(filterString);
//        keeping this just for reference
//        obj.setExpr("Contain ('$bdName', 'Olivers Cooper') and ( '$status' = 'CLOSED' or '$status' = 'IN_PROGRESS')");
        try {
            List<Document> pipeline = commonUtils.crunchReport(obj);
            pipeline.forEach(x-> System.out.println(x.toJson()));
            List<Document> results = leadsRepository.aggregate(pipeline);

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(results);

        } catch (Exception e) {
            logger.error("No Record Found for this request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }


    @PutMapping("/update/{leadsId}")
    public ResponseEntity<Leads> updateLeads(
            @PathVariable String leadsId,
            @RequestBody Leads leadsDetails,
            @RequestHeader("Authorization") String token) {

        logger.info("HTTP PUT request received to update leads with ID: {}", leadsId);
        logger.info("Authorization header: {}", token);
        logger.info("Request Body: {}", leadsDetails);

        Map<String, Object> userDetails = validateToken(token);
        if (userDetails == null || !hasPermission(userDetails, "WRITE:LEAD")) {
            logger.warn("Unauthorized access attempt to update leads with token: {}", token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<Leads> leadsOptional = leadsRepository.findById(leadsId);

        if (leadsOptional.isPresent()) {
            Leads existingLeads = leadsOptional.get();
            existingLeads.setFirstContactDate(leadsDetails.getFirstContactDate());
            existingLeads.setCompanyName(leadsDetails.getCompanyName());
            existingLeads.setInviterName(leadsDetails.getInviterName());
            existingLeads.setTechStackName(leadsDetails.getTechStackName());
            existingLeads.setBdName(leadsDetails.getBdName());
            existingLeads.setCoordinatorName(leadsDetails.getCoordinatorName());
            existingLeads.setProfileName(leadsDetails.getProfileName());
            existingLeads.setStatus(leadsDetails.getStatus());
            existingLeads.setDescription(leadsDetails.getDescription());
            existingLeads.setCallSchedules(leadsDetails.getCallSchedules());
            Leads updatedLeads = leadsRepository.save(existingLeads);
            logger.info("Leads updated: {}", updatedLeads);
            return ResponseEntity.ok(updatedLeads);
        } else {
            logger.warn("Can't update Leads with ID: {}", leadsId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/allLeads")
    public ResponseEntity<List<Leads>> getAllLeads(@RequestHeader("Authorization") String token) {
        
        Map<String, Object> userDetails = validateToken(token);
        if (userDetails == null || !hasPermission(userDetails, "READ:LEAD")) {
            logger.warn("Unauthorized access attempt to get all leads with token: {}", token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Leads> allLeads = leadsRepository.findAll();
        logger.info("Fetched all leads: {}", allLeads);
        return ResponseEntity.ok(allLeads);
    }

}