package com.educacidades.controllers;

import com.educacidades.services.JasperReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class JasperReportController {

    @Autowired
    private JasperReportService jasperReportService;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> generateReport(@PathVariable Long id) throws Exception {
        try {
            byte[] pdf = jasperReportService.generateReport(id, "ec-analise-final");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename("ec-analise-final.pdf").build());

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
