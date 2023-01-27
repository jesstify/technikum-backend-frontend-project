package technikumbackendfrontendproject.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import technikumbackendfrontendproject.Backend.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}