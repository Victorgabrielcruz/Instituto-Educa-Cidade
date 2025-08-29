package com.educacidades.models;

import com.educacidades.utils.ObjectMapperConfig;

public interface IMappable<T> {

    default T toEntity(Class<T> entityClass) {
        return ObjectMapperConfig.OBJECT_MAPPER.convertValue(this, entityClass);
    }
}
