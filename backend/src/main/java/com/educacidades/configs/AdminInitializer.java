package com.educacidades.configs;

import com.educacidades.models.user.User;
import com.educacidades.models.user.enums.EStatus;
import com.educacidades.models.user.enums.ProfileEnum;
import com.educacidades.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            Optional<User> admin = userRepository.findById(1L);

            if (admin.isEmpty()) {
                User user = new User();
                user.setName("admin");
                user.setEmail("admin@admin.com");
                user.setPassword(passwordEncoder.encode("admin"));
                user.setStatus(EStatus.ATIVO);
                user.setProfiles(Stream.of(ProfileEnum.ADMIN.getCode()).collect(Collectors.toSet()));
                userRepository.save(user);
            }
        };
    }
}
