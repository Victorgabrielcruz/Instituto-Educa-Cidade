package com.educacidades.services;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@Service
public class JasperReportService implements Serializable {

    private static final long serialVersionUID = 1L;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public byte[] generateReport(Long id, String reportName) throws Exception {
        Connection conn = jdbcTemplate.getDataSource().getConnection();

        var path = getClass().getResourceAsStream("/reports/" + reportName + ".jasper");

        Map<String, Object> params = new HashMap<>();
        params.put("project_product_id", id);

        JasperPrint print = JasperFillManager.fillReport(path, params, conn);

        return JasperExportManager.exportReportToPdf(print);
    }
}
