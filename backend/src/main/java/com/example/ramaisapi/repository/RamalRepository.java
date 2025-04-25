package com.example.ramaisapi.repository;

import com.example.ramaisapi.model.Ramal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RamalRepository extends JpaRepository<Ramal, Integer> {
}
