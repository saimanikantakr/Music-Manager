package com.example.musicmanager.model;

import jakarta.persistence.*;

@Entity
@Table (name = "users")
public class User {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false,unique = true)
    private String username;

    @Column (nullable = false)
    private String Password;

    @Column (nullable = false)
    private String role;

    public  User(){

    }

    public User(Long id, String username, String password, String role){
        this.id=id;
        this.username=username;
        this.Password=password;
        this.role=role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    
}
