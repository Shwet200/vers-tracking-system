package com.example.vers_db_system.controller;

import org.camunda.bpm.engine.RuntimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/workflow")
public class WorkflowController {

    @Autowired
    private RuntimeService runtimeService;

    @PostMapping("/start")
    public String startWorkflow(@RequestBody Map<String, Object> data) {
        runtimeService.startProcessInstanceByKey("testRequestProcess", data);
        return "Workflow started";
    }

    // Additional endpoints to interact with the workflow can be added here
}
