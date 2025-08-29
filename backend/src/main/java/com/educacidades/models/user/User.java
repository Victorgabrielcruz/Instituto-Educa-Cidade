package com.educacidades.models.user;

import com.educacidades.models.project.Project;
import com.educacidades.models.user.dto.UserDTO;
import com.educacidades.models.user.dto.UserSummaryDTO;
import com.educacidades.models.user.enums.EStatus;
import com.educacidades.models.user.enums.ProfileEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "profile", nullable = false)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "users_profiles")
    @JsonIgnore
    private Set<Integer> profiles = new HashSet<>();

    @ManyToMany(mappedBy = "users")
    private List<Project> projects = new LinkedList<>();

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private EStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Set<ProfileEnum> getProfiles() {
        return this.profiles.stream().map(ProfileEnum::toEnum).collect(Collectors.toSet());
    }
    public long getId() {
        return id;
    }

    public void addProfile(ProfileEnum profileEnum) {
        this.profiles.add(profileEnum.getCode());
    }

    public UserDTO toDTO() {
        return new UserDTO(
                id,
                name,
                email,
                profiles.stream().map(ProfileEnum::toEnum).collect(Collectors.toSet()),
                createdAt
        );
    }

    public UserSummaryDTO toSummaryDTO() {
        return new UserSummaryDTO(
            id,
            name
        );
    }
}
