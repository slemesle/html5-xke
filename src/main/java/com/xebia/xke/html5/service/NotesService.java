package com.xebia.xke.html5.service;

import javax.annotation.Nullable;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;
import com.xebia.xke.html5.model.Note;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service de gestion des notes
 */
public class NotesService {

    private static final Logger log = LoggerFactory.getLogger(NotesService.class);

    private final Map<String, Note> notes;

    public NotesService() {
        notes = new HashMap<String, Note> ();
        Note note = new Note();
        note.content = "Mon contenu";
        note.title = "My first note !";
        note.creationDate = new Date();
        note.userId = "slemesle";
        save(note);
        note = new Note();
        note.content = "Mon contenu";
        note.title = "My second note !";
        note.creationDate = new Date();
        note.userId = "slemesle";
        save(note);
    }

    public List<Note> getAllNotes(){
        return Lists.newArrayList(notes.values());
    }
    
    public Note save(Note note){
        log.info("Saving note {}", note.id);
        if (note.id != null){
            note.lastUpdate = new Date();
            notes.put(note.id, note);
        } else {
            note.id = UUID.randomUUID().toString();
            note.creationDate = new Date();
            note.lastUpdate = new Date();
            notes.put(note.id, note);
        }
        return note;
    }

    public Note getNote(String id){
        return notes.get(id);
    }

    public Collection<Note> findNote(final String searchKey){
       return Collections2.filter(notes.values(), new Predicate<Note>() {
           public boolean apply(@Nullable Note note) {
               boolean res = false;
               if (note.id.equals(searchKey)) {
                   res = true;
               } else if (note.title.contains(searchKey)) {
                   res = true;
               } else if (note.content.contains(searchKey)) {
                   res = true;
               }
               return res;
           }
       });
    }
    
    public boolean delete(String id){
        return notes.remove(id) != null;
    }
}
