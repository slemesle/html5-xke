package com.xebia.xke.html5.service;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.xebia.xke.html5.model.Note;

/**
 * Service de gestion des notes
 */
public class NotesService {


    private final Map<String, Note> notes = new HashMap<String, Note> ();

    public List<Note> getAllNotes(){
        return Lists.newCopyOnWriteArrayList(notes.values());
    }
    
    public Note save(Note note){
        if (note.id != null){
            notes.put(note.id, note);
        } else {
            note.id = UUID.randomUUID().toString();
            notes.put(note.id, note);
        }
        return note;
    }

    public Note getNote(String id){
        return notes.get(id);
    }

    public Iterable<Note> findNote(final String searchKey){
       return Iterables.filter(notes.values(), new Predicate<Note>() {
            public boolean apply(@Nullable Note note) {
                boolean res = false;
                if (note.id.equals(searchKey) ){
                    res = true;
                }else if (note.title.contains(searchKey)){
                    res = true;
                }else if (note.content.contains(searchKey)){
                    res = true;
                }
                return false;
            }
        });
    }
    
    public boolean delete(String id){
        return notes.remove(id) != null;
    }
}
