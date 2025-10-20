package com.example.tuevents.repo;

import com.example.tuevents.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // <<< สำคัญ
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.Collection;
import java.util.Date;
import java.util.Optional;

public interface EventRepository  extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    Page<Event> findAllByCategory_CategoryId(Long categoryId, Pageable pageable);
    
    Page<Event> findAllByCategory_CategoryIdIn(Collection<Long> categoryIds, Pageable pageable);
    
    Page<Event> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    
    Page<Event> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String keyword1, String keyword2, Pageable pageable);
    


    @Query
    ("""
            SELECT e FROM Event e
            WHERE (:start IS NULL OR e.endDate   >= :start)
              AND (:end   IS NULL OR e.startDate <= :end)
            """)
     Page<Event> findByDateRangeOverlap(@Param("start") Date start,
                                        @Param("end")   Date end,
                                        Pageable pageable);

     // ----- (ตัวเลือก) ถ้าต้องการ "อยู่ภายในช่วงทั้งหมด" ให้ใช้ตัวนี้แทน
     @Query("""
             SELECT e FROM Event e
           WHERE (:start IS NULL OR e.startDate >= :start)
              AND (:end   IS NULL OR e.endDate   <= :end)
             """)
      Page<Event> findByDateRangeWithin(@Param("start") Date start,
                                        @Param("end")   Date end,
                                        Pageable pageable);
     
     Optional<Event> findByEventIdAndActiveTrue(Long eventId);	

}
