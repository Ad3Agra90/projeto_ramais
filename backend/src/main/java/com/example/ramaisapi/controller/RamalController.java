package com.example.ramaisapi.controller;

import com.example.ramaisapi.model.Range;
import com.example.ramaisapi.model.Ramal;
import com.example.ramaisapi.service.RamalService;
import com.example.ramaisapi.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RamalController {

    private static final Logger logger = LoggerFactory.getLogger(RamalController.class);

    @Autowired
    private RamalService ramalService;

    @Autowired
    private LogService logService;
    
    @GetMapping("/range")
    public ResponseEntity<Range> getRange() {
        logger.info("GET /range called");
        Range range = ramalService.getRange();
        logger.info("Range returned: start={}, end={}", range.getStart(), range.getEnd());
        return ResponseEntity.ok(range);
    }
    
    @PostMapping("/range")
    public ResponseEntity<Range> saveRange(@RequestBody RangeRequest request) {
        logger.info("POST /range called with start={}, end={}, user={}", request.getStart(), request.getEnd(), request.getUser());
        if (request.getStart() > request.getEnd()) {
            logger.warn("Invalid range: start > end");
            return ResponseEntity.badRequest().build();
        }
        
        Range savedRange = ramalService.setRange(request.getStart(), request.getEnd(), request.getUser());
        logger.info("Range saved: start={}, end={}", savedRange.getStart(), savedRange.getEnd());
        return ResponseEntity.ok(savedRange);
    }
    
    @GetMapping("/ramais")
    public ResponseEntity<List<Ramal>> getRamais() {
        logger.info("GET /ramais called");
        List<Ramal> ramais = ramalService.getRamais();
        logger.info("Number of ramais returned: {}", ramais.size());
        return ResponseEntity.ok(ramais);
    }
    
    @PostMapping("/ramais/login/{id}")
    public ResponseEntity<Ramal> login(@PathVariable int id, @RequestBody UserRequest userRequest) {
        Ramal ramal = ramalService.login(id, userRequest.getUsuario());
        return ResponseEntity.ok(ramal);
    }

    @PostMapping("/ramais/logout/{id}")
    public ResponseEntity<Ramal> logout(@PathVariable int id) {
        Ramal ramal = ramalService.logout(id);
        return ResponseEntity.ok(ramal);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<com.example.ramaisapi.model.LogEntry>> getLogs() {
        logger.info("GET /logs called");
        List<com.example.ramaisapi.model.LogEntry> logs = logService.getAllLogs();
        logger.info("Number of logs returned: {}", logs.size());
        return ResponseEntity.ok(logs);
    }
    
    // Request class for the range endpoint
    public static class RangeRequest {
        private Integer start;
        private Integer end;
        private String user;
        
        // Getters and setters
        public Integer getStart() {
            return start;
        }
        
        public void setStart(Integer start) {
            this.start = start;
        }
        
        public Integer getEnd() {
            return end;
        }
        
        public void setEnd(Integer end) {
            this.end = end;
        }
        
        public String getUser() {
            return user;
        }
        
        public void setUser(String user) {
            this.user = user;
        }
    }
    
    public static class UserRequest {
        private String usuario;

        public String getUsuario() {
            return usuario;
        }

        public void setUsuario(String usuario) {
            this.usuario = usuario;
        }
    }
}
