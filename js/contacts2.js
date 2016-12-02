(function () {
    //simulated data
    var CONTACTS = [
		{
		    id: 1,
		    name: 'William',
		    address: '1 CanJS Way',
		    email: 'william@husker.com',
		    phone: '0123456789',
		    category: 'co-workers'
		},
		{
		    id: 2,
		    name: 'Laura',
		    address: '1 CanJS Way',
		    email: 'laura@starbuck.com',
		    phone: '0123456789',
		    category: 'friends'
		},
		{
		    id: 3,
		    name: 'Lee',
		    address: '1 CanJS Way',
		    email: 'lee@apollo.com',
		    phone: '0123456789',
		    category: 'family'
		},
        {
            id: 4,
            name: 'Lee2',
            address: '1 CanJS Way',
            email: 'lee@apollo.com',
            phone: '0123456789',
            category: 'family'
        }
    ];
    var CATEGORIES = [
		{
		    id: 1,
		    name: 'Family',
		    data: 'family'
		},
		{
		    id: 2,
		    name: 'Friends',
		    data: 'friends'
		},
		{
		    id: 3,
		    name: 'Co-workers',
		    data: 'co-workers'
		}
    ];

    //route
    can.route('filter/:category');
    can.route('', { category: 'all' });

    //model
    Contact = can.Model({
        findAll: 'GET /contacts',
        create: 'POST /contacts',
        update: 'PUT /contacts/{id}',
        destroy: 'DELETE /contacts/{id}'
    }, {});
    Contact.List = can.Model.List({
        filter: function (category) {
            this.attr('length');  //for live bind
            var contacts = [];
            this.each(function (contact, i) {
                if (category == 'all' || category == contact.attr('category')) {
                    contacts.push(contact);
                };
            });
            return contacts;
        },
        count: function (category) {
            return this.filter(category).length;
        }
    });
    Category = can.Model({
        findAll: 'GET /categories'
    }, {});

    //simulated service
    can.fixture('GET /contacts', function () {
        return [CONTACTS];
    });
    var id = 5;
    can.fixture('POST /contacts', function () {
        return { id: (id++) };
    });
    can.fixture('PUT /contacts/{id}', function () {
        return {}
    });
    can.fixture('DELETE /contacts/{id}', function () {
        return {}
    });
    can.fixture('GET /categories', function () {
        return [CATEGORIES];
    });

    //control
    Contacts = can.Control({
        init: function () {
            this.element.html(can.view('views/contactsList2.ejs', {
                contacts: this.options.contacts,
                categories: this.options.categories
            }))
        },
        //add events to contact element to realize updating feature
        '.contact input focusout': function (el) {
            this.updateContact(el);
        },
        '.contact input keyup': function (el,ev) {
            if (ev.keyCode == 13) {
                el.trigger('blur')
            }
        },
        '.contact select change': function (el) {
            this.updateContact(el)
        },
        updateContact: function (el) {
            var contact = el.closest('.contact').data('contact');  //find the closet .contact element and retrieve the model instance using $.data()
            contact.attr(el.attr('name'), el.val()).save();  //find the correct attr based on el.attr('name') and change it and save it
        },
        '.remove click': function (el) {
            el.closest('.contact').data('contact').destroy();
        },
        '{Contact} created': function (list, ev, contact) {
            this.options.contacts.push(contact);
        },
    });
    Filter = can.Control({
        init: function () {
            var category = can.route.attr('category') || 'all';
            this.element.find('[data-category="' + category + '"]').parent().addClass('active');
            this.element.html(can.view('views/filterView2.ejs', {
                contacts: this.options.contacts,
                categories: this.options.categories
            }));
        },
        '[data-category] click': function (el) {
            this.element.find('[data-category]').parent().removeClass('active');
            el.parent().addClass('active');
            can.route.attr('category', el.data('category'));
        }
    });
    Create = can.Control({
        show: function () {
            this.contact = new Contact();
            this.element.html(can.view('views/createView2.ejs', {
                contact: this.contact,
                categories:this.options.categories
            }));
            this.element.slideDown(200);
        },
        hide:function(){
            this.element.slideUp(200);
        },
        '.contact input keyup':function(el, ev){
            if (ev.keyCode == 13) {
                this.createContact(el);
            }
        },
        '.save click':function(el){
            this.createContact(el);
        },
        '.cancel click':function(){
            this.hide();
        },
        createContact:function(el){
            var form = this.element.find('form');
            values = can.deparam(form.serialize()); //use jquery serialize() to find all the values of form as a string. use can.deparam to convert string to an object
            if (values.name != '') {
                this.contact.attr(values).save();
                this.hide();
            }
        },
        '{document} #new-contact click': function () {
            this.show();
        }
    });

    //bootstrap the app
    $(document).ready(function () {
        $.when(Contact.findAll(),Category.findAll()).then(function (contactResponse, categoryResponse) {
            var contacts = contactResponse[0];
            var categories = categoryResponse[0];
            new Create('#create', {
                categories:categories
            });
            new Contacts('#contacts', {
                contacts: contacts,
                categories: categories
            });
            new Filter('#filter', {
                contacts: contacts,
                categories: categories
            });
        });
    });
})()
