package com.example.tuevents.repo;

import com.example.tuevents.model.UserFavorite;
import com.example.tuevents.model.Account;
import com.example.tuevents.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
	
	//Start Task4 : US6
    List<UserFavorite> findByAccount(Account account);

    Optional<UserFavorite> findByAccountAndEvent(Account account, Event event);

    boolean existsByAccountAndEvent(Account account, Event event);

    long countByEvent(Event event);
    //End Task4 : US6
    
}
