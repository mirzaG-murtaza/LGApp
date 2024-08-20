package com.example.demo.controller;

import com.example.demo.entity.Leads;
import com.example.demo.repository.LeadsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadsController {

    @Autowired
    private LeadsRepository leadsRepository;

    private static final Logger logger = LoggerFactory.getLogger(LeadsController.class);

    @GetMapping("/{leadsId}")
    public ResponseEntity<Leads> getLeadsById(@PathVariable String leadsId) {
        logger.info("Fetching leads with ID: {}", leadsId);
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
    public ResponseEntity<Leads> createLeads(@RequestBody Leads leads) {
        leads.setId(null);
        logger.info("Creating a new leads");
        Leads savedLeads = leadsRepository.save(leads);
        logger.info("Leads created with ID: {}", savedLeads.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLeads);
    }

    @PutMapping("/update/{leadsId}")
    public ResponseEntity<Leads> updateLeads(@PathVariable String leadsId, @RequestBody Leads leadsDetails) {
        logger.info("Updating leads with ID: {}", leadsId);
        Optional<Leads> leadsOptional = leadsRepository.findById(leadsId);
        logger.info("Received Leads Details: {}", leadsDetails);


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
}
