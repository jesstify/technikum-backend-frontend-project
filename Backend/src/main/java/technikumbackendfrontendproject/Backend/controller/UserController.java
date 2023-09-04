package technikumbackendfrontendproject.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import technikumbackendfrontendproject.Backend.model.User;
import technikumbackendfrontendproject.Backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Long> createUser(@RequestBody User user) {
        userService.registerUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public List<User> findAllUsers() {
        return userService.findAll();
    }
}

/*
 * Zusammengefasst > "Macht viele coole Sachen" - Zitat Mladen
 * Haben uns das JASON vom Javascript schicken lassen, dies ist die 1. Instanz
 * 
 * @RestController > schreibt man immer wenn man Springboot verwendet
 * 
 * @RequestMapping auf welche URL(Pfad) zugegriffen wird
 * Autowired: wenn es gebraucht wird, wird eine Instanz von registrationService
 * erstellt
 * 
 * @PostMapping
 * Alle Subpfade weitermappen (Localhost 8080/registration/register > dann wird
 * die Methode public ResponeEntity ausgeführt)
 * 
 * Was passiert in methode ResponseEntity (RE): RE übernimmt Objekt Long und es
 * schickt den HTTP-Status zurück
 * 
 * @RequestBody
 * der Postrequest den wir von Javascript bekommen haben, Data von Typ JSON ein
 * Objekt, haben wir gemoddelt auf die Klasse Registration > weiter zu
 * registration.java
 * 
 * Zurück von registration.java
 * bekommen @Requestbody übergeben mit variablenname registration (wie zb String
 * Name)
 * 
 * rufen createRegistration auf und übergeben variable registration(der klasse
 * registration)
 * 
 * Wir gehen jetzt in registrationservice rein
 */
