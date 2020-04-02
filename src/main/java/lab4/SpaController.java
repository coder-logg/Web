package lab4;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/area")
public class SpaController {

    @RequestMapping
    public String request() {
        return "forward://index.html";
    }
}
