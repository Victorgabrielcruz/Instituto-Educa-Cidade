package com.educacidades.repositories;

import com.educacidades.models.default_task.DefaultTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DefaultTaskRepository extends JpaRepository<DefaultTask, Long> {
}
