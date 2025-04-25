package com.example.ramaisapi.service;

import com.example.ramaisapi.model.Ramal;
import com.example.ramaisapi.model.Range;
import com.example.ramaisapi.repository.RamalRepository;
import com.example.ramaisapi.repository.RangeRepository;
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
                        int num = Integer.parseInt(r.getNumero());
                        return num >= range.getStart() && num <= range.getEnd();
                    } catch (NumberFormatException e) {
                        logger.warn("Número inválido no ramal: {}", r.getNumero());
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
                    ramal.setNumero(String.valueOf(id));
                    ramal.setUsuario(null);
                    ramal.setLogado(false);
                    ramalRepository.save(ramal);
                });
    }

    public Ramal login(int id, String usuario) {
        Ramal ramal = ramalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ramal não encontrado"));
        ramal.setUsuario(usuario);
        ramal.setLogado(true);
        return ramalRepository.save(ramal);
    }

    public Ramal logout(int id) {
        Ramal ramal = ramalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ramal não encontrado"));
        ramal.setUsuario(null);
        ramal.setLogado(false);
        return ramalRepository.save(ramal);
    }
}
