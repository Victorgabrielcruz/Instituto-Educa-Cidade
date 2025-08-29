package com.educacidades.repositories;

import com.educacidades.models.task.Task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByProjectProductId(Long projectProductId);
    Integer countByResponsibleId(Long responsibleId);
}