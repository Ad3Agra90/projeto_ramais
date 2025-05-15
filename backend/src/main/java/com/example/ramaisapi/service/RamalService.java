package com.example.ramaisapi.service;

import com.example.ramaisapi.model.Ramal;
import com.example.ramaisapi.model.Range;
import com.example.ramaisapi.repository.RamalRepository;
import com.example.ramaisapi.repository.RangeRepository;
import com.example.ramaisapi.service.NotificationService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class RamalService {

    private static final Logger logger = LoggerFactory.getLogger(RamalService.class);

    @Autowired
    private RamalRepository ramalRepository;

    @Autowired
    private RangeRepository rangeRepository;

    @Autowired
    private LogService logService;

    @Autowired
    private NotificationService notificationService;

    @PostConstruct
    public void init() {
        if (rangeRepository.count() == 0) {
            Range defaultRange = new Range();
            defaultRange.setStart(1000);
            defaultRange.setEnd(1010);
            rangeRepository.save(defaultRange);
            initializeRamais(defaultRange);
        }
    }

    public List<Ramal> getRamais() {
        Range range = getRange();
        return ramalRepository.findAll().stream()
                .filter(r -> {
                    try {
                        int num = Integer.parseInt(r.getExtension_number());
                        return num >= range.getStart() && num <= range.getEnd();
                    } catch (NumberFormatException e) {
                        logger.warn("Número inválido no ramal: {}", r.getExtension_number());
                        return false;
                    }
                })
                .collect(Collectors.toList());
    }

    public Range getRange() {
        return rangeRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Range não configurado"));
    }

    @Transactional
    public Range setRange(int start, int end, String user) {
        if (start > end) {
            throw new IllegalArgumentException("Início do intervalo não pode ser maior que o fim.");
        }

        Optional<Range> optionalRange = rangeRepository.findAll().stream().findFirst();
        Range range = optionalRange.orElse(new Range());

        range.setStart(start);
        range.setEnd(end);

        range = rangeRepository.save(range);

        try {
            ramalRepository.deleteAll();
        } catch (Exception e) {
            logger.error("Erro ao apagar ramais", e);
            throw new RuntimeException("Erro ao limpar ramais antigos.");
        }

        initializeRamais(range);

        String actionDescription = String.format("Intervalo atualizado para: início %d, fim %d", start, end);
        logService.logAction(user, actionDescription);

        return range;
    }

    @Transactional
    public void initializeRamais(Range range) {
        IntStream.rangeClosed(range.getStart(), range.getEnd())
                .forEach(id -> {
                    Ramal ramal = new Ramal();
                    ramal.setId(id);
                    ramal.setExtension_number(String.valueOf(id));
                    ramal.setUser(null);
                    ramal.setLogged_user(null);
                    ramalRepository.save(ramal);
                });
    }

    public Ramal login(int id, String user) {
        Ramal ramal = ramalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ramal não encontrado"));
        if (ramal.getLogged_user() != null && ramal.getLogged_user()) {
            throw new RuntimeException("Ramal está ocupado");
        }
        ramal.setUser(user);
        ramal.setLogged_user(true);
        Ramal savedRamal = ramalRepository.save(ramal);
        notificationService.sendUpdate("/topic/ramais", savedRamal);
        return savedRamal;
    }

    public Ramal logout(int id) {
        Ramal ramal = ramalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ramal não encontrado"));
        ramal.setUser(null);
        ramal.setLogged_user(null);
        Ramal savedRamal = ramalRepository.save(ramal);
        notificationService.sendUpdate("/topic/ramais", savedRamal);
        return savedRamal;
    }

    @Transactional
    public void logoutAllByUser(String user) {
        List<Ramal> ramais = ramalRepository.findByUser(user);
        for (Ramal ramal : ramais) {
            ramal.setUser(null);
            ramal.setLogged_user(null);
            Ramal savedRamal = ramalRepository.save(ramal);
            notificationService.sendUpdate("/topic/ramais", savedRamal);
        }
    }
}
