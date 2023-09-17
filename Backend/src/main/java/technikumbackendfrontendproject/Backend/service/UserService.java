package technikumbackendfrontendproject.Backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import technikumbackendfrontendproject.Backend.model.DTO.UserDTO;
import technikumbackendfrontendproject.Backend.model.User;
import technikumbackendfrontendproject.Backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class UserService implements saveUser {

    Logger logger = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);
    private UserRepository userRepository;
    private String convertedID;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public User saveUser(User user) {
        System.out.println("saving user (service)");
        return userRepository.save(user);
    }

    public String updateUser(User user) {
        //exist in the user object - yes - update, no - create/add
        boolean resourceFound = false;
        for(User currentUser: findAll()) {
            if(currentUser.getId() == user.getId()) {
                currentUser.setId(user.getId());
            }
        }
        if(!resourceFound){
            findAll().add(user);
            return "Item Added Successfully";
        }
    return "Item Updated Successfully";
    }

    public void deleteUser(Long id) {
       convertedID = String.valueOf(id);
        // Check if the user exists
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
        } else {
            // User not found, you can handle this as needed (e.g., throw an exception or return a status)
            throw new EntityNotFoundException("User with ID " + convertedID + " not found");
        }
    }
    public void registerUser(User user) {
        user.setRole("Customer");
        user.setStatus("active");
        userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User getUser(Long id) {
        var user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new EntityNotFoundException();
        }
        User user2 = user.get();
        return user2;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);

    }

    public User updateUser(Long existingUserId, UserDTO updatedUserDto) {
        var existingUser = userRepository.findById(existingUserId);

        if (existingUser.isEmpty()) {
            throw new EntityNotFoundException("User with id: " + existingUserId + " does not exist!");
        } else {
            User updatedUser = existingUser.get();

            // Update the user information with values from the DTO
            logger.info("Updating USERNAME: " + updatedUser.getUsername() + " -> " + updatedUserDto.getUsername());
            updatedUser.setUsername(updatedUserDto.getUsername());
            logger.info("Updating STATUS: " + updatedUser.getStatus() + " -> " + updatedUserDto.getStatus());
            updatedUser.setStatus(updatedUserDto.getStatus());
            logger.info("Updating ROLE: " + updatedUser.getRole() + " -> " + updatedUserDto.getRole());
            updatedUser.setRole(updatedUserDto.getRole());
            logger.info("Updating EMAIL: " + updatedUser.getEmail() + " -> " + updatedUserDto.getEmail());
            updatedUser.setEmail(updatedUserDto.getEmail());
            logger.info("Updating GENDER: " + updatedUser.getGender() + " -> " + updatedUserDto.getGender());
            updatedUser.setGender(updatedUserDto.getGender());
            logger.info("Updating FIRSTNAME: " + updatedUser.getFirstName() + " -> " + updatedUserDto.getFirstName());
            updatedUser.setFirstName(updatedUserDto.getFirstName());
            logger.info("Updating LASTNAME: " + updatedUser.getLastname() + " -> " + updatedUserDto.getLastName());
            updatedUser.setLastName(updatedUserDto.getLastName());
            //logger.info("Updating USERNAME: " + updatedUser.getUsername() + " -> " + updatedUserDto.getUsername());
            updatedUser.setLocation(updatedUserDto.getLocation());
            //logger.info("Updating USERNAME: " + updatedUser.getUsername() + " -> " + updatedUserDto.getUsername());
            updatedUser.setPassword(updatedUserDto.getPassword());
            //logger.info("Updating USERNAME: " + updatedUser.getUsername() + " -> " + updatedUserDto.getUsername());
            updatedUser.setPostcode(updatedUserDto.getPostcode());
            //logger.info("Updating USERNAME: " + updatedUser.getUsername() + " -> " + updatedUserDto.getUsername());
            updatedUser.setStreet(updatedUserDto.getStreet());
            //logger.info("Updating USERNAME: " + updatedUser.getUsername() + " -> " + updatedUserDto.getUsername());
            updatedUser.setStreetnumber(updatedUserDto.getStreetNumber());
            // Save the updated user
            userRepository.save(updatedUser);
            return updatedUser;
        }
    }
    // Utility method to convert a User entity to UserDto
    public UserDTO convertToUserDto(User user) {
        UserDTO userDto = new UserDTO();
        userDto.setUsername(user.getUsername());
        userDto.setStatus(user.getStatus());
        userDto.setRole(user.getRole());
        userDto.setEmail(user.getEmail());
        userDto.setGender(user.getGender());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastname());
        userDto.setLocation(user.getLocation());
        userDto.setPassword(user.getPassword());
        userDto.setPostcode(user.getPostcode());
        userDto.setStreet(user.getStreet());
        userDto.setStreetNumber(user.getStreetnumber());
        return userDto;
    }

}




