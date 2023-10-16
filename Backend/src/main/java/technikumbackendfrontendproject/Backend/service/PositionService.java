package technikumbackendfrontendproject.Backend.service;

import java.util.Optional;
import java.util.logging.Logger;

import org.hibernate.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import technikumbackendfrontendproject.Backend.model.Cart;
import technikumbackendfrontendproject.Backend.model.Position;
import technikumbackendfrontendproject.Backend.model.Product;
import technikumbackendfrontendproject.Backend.model.User;
import technikumbackendfrontendproject.Backend.repository.PositionRepository;
import technikumbackendfrontendproject.Backend.repository.UserRepository;

@Service
public class PositionService {
    @Autowired
    private final PositionRepository positionRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final UserService userService;
    @Autowired
    private final CartService cartService;
    @Autowired
    private final ProductService productService;

    Logger logger = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);


    public PositionService(PositionRepository positionRepository, UserRepository userRepository, UserService userService, CartService cartService, ProductService productService) {
        this.positionRepository = positionRepository;
        this.userService = userService;
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    public Optional<Position> findById(Long id) {
        return positionRepository.findById(id);
    }

    public Position findByUserId(Long userId) {
        try {
            return positionRepository.findByUserId(userId).get();
        } catch(ObjectNotFoundException e) {
            throw new RuntimeException("No Position for user with id: "+ userId);
        }

    }

    public Position save(Position position, Long userId, Long productId) {
        Cart cart = cartService.findByUserId(userId);

        if (cart == null)  {
            Optional<User> user = userRepository.findById(userId);

            if (user.isPresent()) {
                cart = cartService.save(new Cart(user.get()));
            } else {
                throw new RuntimeException("User does not exist");
            }
        }

        Product product = productService.findById(productId);

        position.setCart(cart);
        position.setProduct(product);

        return positionRepository.save(position);
    }

    public Position create(Long userId, Long productId) {
        logger.info("in positionService");
       User user = userService.findById(userId);
       Product product = productService.findById(productId);
       // This is faster :)
       Cart cart = user.getCart();

       // Cart cart = cartService.findByUserId(userId);

        Position position = new Position();
        position.setCart(cart);
        position.setProduct(product);
        position.setQuantity(1);

        return positionRepository.save(position);
    }

    public Position update(Position position, Boolean isAdded) {
        Integer quantity = position.getQuantity();
        if (isAdded) {
            position.setQuantity(quantity + 1);
        } else if (quantity <= 0) {
            throw new IllegalArgumentException("Product quantity cannot be: " + quantity);
        } else if (quantity == 1){
            positionRepository.delete(position);
            return null;
        } else {
            position.setQuantity(quantity - 1);
        }
        return positionRepository.save(position);
    }


}