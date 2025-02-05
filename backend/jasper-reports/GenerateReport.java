
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.Map;
public class GenerateReport {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Please provide a patient ID.");
            return;
        }
        String patientId = args[0];
        try {
            // Load database credentials from environment variables
            String url = System.getenv("DB_URL");
            String username = System.getenv("DB_USER");
            String password = System.getenv("DB_PASSWORD");
            if (url == null || username == null || password == null) {
                System.out.println("Database credentials are not set in environment variables.");
                return;
            }
            System.out.println("DB_URL: " + url);
            System.out.println("DB_USER: " + username);
            // Do not print the password for security reasons
            // Database connection
            Connection connection = DriverManager.getConnection(url, username, password);
            System.out.println("Database connection established.");
            // Parameters
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("Patient_ID", Integer.parseInt(patientId));
            // Compile the report
            String sourceFileName = "reports/PatientBill.jrxml";
            File reportFile = new File(sourceFileName);
            System.out.println("Looking for report file at: " + reportFile.getAbsolutePath());
            if (!reportFile.exists()) {
                System.out.println("Report file not found: " + reportFile.getAbsolutePath());
                return;
            }
            // Load and compile the JRXML file
            JasperDesign jasperDesign = JRXmlLoader.load(reportFile);
            JasperReport jasperReport = JasperCompileManager.compileReport(jasperDesign);
            System.out.println("Report compiled successfully.");
            // Fill the report
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, connection);
            System.out.println("Report filled successfully.");
            // Ensure the output directory exists
            File outputDir = new File("output");
            if (!outputDir.exists()) {
                outputDir.mkdirs();
            }
            // Export to PDF
            String outputFileName = "output/PatientBill.pdf";
            JasperExportManager.exportReportToPdfStream(jasperPrint, new FileOutputStream(new File(outputFileName)));
            System.out.println("Report generated successfully!");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
