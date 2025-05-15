package com.example.ramaisapi.repository;

import com.example.ramaisapi.model.Ramal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RamalRepository extends JpaRepository<Ramal, Integer> {
    List<Ramal> findByUser(String user);
}
