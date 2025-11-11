package com.example.tuevents.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tuevents.model.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
	
	//Start Task4 : US6
    Optional<Account> findByAnonId(String anonId);
    boolean existsByAnonId(String anonId);
    //End Task4 : US6
}
