package com.dealership.vehicle;

import com.dealership.entity.Vehicle;
import com.dealership.vehicle.dto.VehicleSearchCriteria;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    public static Specification<Vehicle> withCriteria(VehicleSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.make() != null && !criteria.make().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("make")), "%" + criteria.make().toLowerCase() + "%"));
            }
            if (criteria.model() != null && !criteria.model().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("model")), "%" + criteria.model().toLowerCase() + "%"));
            }
            if (criteria.category() != null && !criteria.category().isBlank()) {
                predicates.add(cb.equal(root.get("category"), criteria.category()));
            }
            if (criteria.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.minPrice()));
            }
            if (criteria.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.maxPrice()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
