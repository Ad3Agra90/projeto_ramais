package com.example.ramaisapi.service;

import com.example.ramaisapi.model.LogEntry;
import com.example.ramaisapi.repository.LogEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogService {

    @Autowired
    private LogEntryRepository logEntryRepository;

    public LogEntry logAction(String user, String actionDescription) {
        LogEntry logEntry = new LogEntry();
        logEntry.setTimestamp(LocalDateTime.now());
        logEntry.setUser(user);
        logEntry.setActionDescription(actionDescription);
        return logEntryRepository.save(logEntry);
    }

    public List<LogEntry> getAllLogs() {
        return logEntryRepository.findAll();
    }
}
