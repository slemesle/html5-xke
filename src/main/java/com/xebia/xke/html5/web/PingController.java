package com.xebia.xke.html5.web;

import java.util.HashMap;

import com.google.common.collect.Lists;
import com.xebia.xke.html5.model.Ping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 */
@Controller
@RequestMapping("/ping.html")
public class PingController {

    @RequestMapping( method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<Ping> allNotes(){

        MultiValueMap map = CollectionUtils.toMultiValueMap(new HashMap());
        map.put("Pragma", Lists.newArrayList("no-cache"));
        map.put("Cache-Control", Lists.newArrayList("no-cache, must-revalidate"));
        map.put("Content-Type", Lists.newArrayList("application/json"));
        ResponseEntity responseEntity= new ResponseEntity<Ping>(new Ping(), map, HttpStatus.OK );
        return responseEntity;
    }
}
