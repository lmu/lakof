jQuery(document).ready(function() {

    // Prepare the html of a page to be used as a accordion
    var transformAccordion = function(selector) {

        var header_dest, content_html, content, stack,
            tmp_div, header, all, search_headers, li, inner_klass, header_klass, inner_style;
        var insert_target = '<ul class="accordion"></ul>'
        stack = '';
        tmp_div = '<div></div>'

        // only apply to normal content (not controlpanels)
        content_area = jQuery('#region-content,#content');
        if (!content_area) {return;}

        // stop when no accordion-headers exist
        if (!selector) {selector = 'h2.accordion';};
        search_headers = jQuery(content_area).find(selector);
        if (!search_headers.length) {return;};

        // 1. Insert the html-struture in which to construct the tabs
        jQuery(search_headers[0]).before(insert_target);

        // 2. Retrieve it to add the content.
        dest = jQuery('ul.accordion');

        // 3. Handle headers in document order
        jQuery(search_headers).each(function(i) {
            // optionally open first item
            // if (i == 0) {
            //     header_klass = 'toggle active'
            //     inner_klass = 'inner showpanel'
            //     inner_style = 'style="display: block;"'
            // } else {
            //     header_klass = 'toggle'
            //     inner_klass = 'inner'
            //     inner_style = ''
            // };

            // all elements are closed
            header_klass = 'toggle'
            inner_klass = 'inner'
            inner_style = ''

            // Turn header to link
            header = '<li><a class="' + header_klass + '" href="javascript:void(0);">' + jQuery(this).text() + '</a>';
            // Get all html until the next h2
            content_html = jQuery(tmp_div).append(jQuery(this).nextUntil('h2, h1, div.stop')).html();
            // Construct a inner section from that and stash it, dropping the original
            content = header + '<div class="' + inner_klass + '"' + inner_style + '>' + content_html + '</div></li>';
            stack += content;
            jQuery(this).remove();
        });

        // 4. Insert and display the finished accordion
        if (stack.length) {
            dest.append(stack);
            dest.show();
        };
    };

    transformAccordion("h2.accordion");

    // Turn the prepared html into a accordion
    // stolen from https://codepen.io/brenden/pen/Kwbpyj
    jQuery('.toggle').click(function(e) {
        e.preventDefault();

        var $this = jQuery(this);

        if ( $this.next().hasClass('showpanel') ) {
            $this.parent().parent().find('.active').removeClass('active');
            $this.removeClass('active');
            $this.next().removeClass('showpanel');
            $this.next().slideUp(350);
        } else {
            $this.parent().parent().find('.active').removeClass('active');
            $this.addClass('active');
            // optionally close all open items
            // $this.parent().parent().find('li .inner').removeClass('show');
            // $this.parent().parent().find('li .inner').slideUp(350);
            $this.next().toggleClass('showpanel');
            $this.next().slideToggle(350);
        }
    });

    // TODO: this does not work yet!
    jQuery("div.mce-edit-area>iframe").on("load", function() {
        let head = jQuery("div.mce-edit-area>iframe").contents().find("head");
        let css = `<style>
#tinymce h2.accordion {
  width: 100%;
  font-weight: bold;
  display: block;
  background: #205c90;
  color: #fff !important;
  padding: .75em;
  border-radius: 0.15em;
  transition: background .3s ease;
  position: relative;
}

#tinymce h2.accordion:after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  border: solid 6px;
  border-color: #fff transparent transparent transparent;
  position: absolute;
  right: 30px;
  top: 12px;
}
</style>`;
        jQuery(head).append(css);
    });

 });

