package com.example.springboot.jpa;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "guest", path = "guest")
public interface GuestRepository extends PagingAndSortingRepository<Guest, Long> {

  List<Guest> findByLastName(@Param("name") String name);

}