package com.xebia.xke.html5.web;

import com.xebia.xke.html5.service.NotesService;
import com.xebia.xke.html5.model.Note;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by IntelliJ IDEA.
 * User: slm
 * Date: 19/09/12
 * Time: 00:52
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    NotesService service;

      @RequestMapping(  value = "/hello", method = RequestMethod.GET, produces = "text/plain")
      public ResponseEntity<String> sayHello(){
          ResponseEntity<String> responseEntity = new ResponseEntity<String>( "hello man !",HttpStatus.OK);
          return responseEntity;
      }
    
    @RequestMapping(value = "/save", method = RequestMethod.POST, produces = "text/json")
    public ResponseEntity<Note> save(@RequestBody Note note){
        return new ResponseEntity<Note>(service.save(note), HttpStatus.OK);
    }

}
