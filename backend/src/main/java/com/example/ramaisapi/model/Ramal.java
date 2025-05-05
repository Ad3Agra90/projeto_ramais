package com.example.ramaisapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "extensions")
public class Ramal {
    @Id
    private Integer id;
    private String extension_number;
    private String user;
    private Boolean logged_user; // Changed to Boolean to allow null

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getExtension_number() {
        return extension_number;
    }

    public void setExtension_number(String extension_number) {
        this.extension_number = extension_number;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Boolean getLogged_user() {
        return logged_user;
    }

    public void setLogged_user(Boolean logged_user) {
        this.logged_user = logged_user;
    }
}
