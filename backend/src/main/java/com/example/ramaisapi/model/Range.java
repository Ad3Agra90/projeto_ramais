package com.example.ramaisapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;

@Entity
@Table(name = "range_config")
public class Range {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Min(1)
    private Integer start;

    @NotNull
    @Min(1)
    private Integer end;

    public Range() {
    }

    public Range(Integer id, Integer start, Integer end) {
        this.id = id;
        this.start = start;
        this.end = end;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public boolean isValidRange() {
        return start != null && end != null && start <= end;
    }
}
