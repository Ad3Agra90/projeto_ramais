package com.example.ramaisapi.repository;

import com.example.ramaisapi.model.Range;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RangeRepository extends JpaRepository<Range, Integer> {
}