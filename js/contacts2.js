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
        findAll:'GET /contacts'
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
        }
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

    //bootstrap the app
    $(document).ready(function () {
        $.when(Contact.findAll(),Category.findAll()).then(function (contactResponse, categoryResponse) {
            var contacts = contactResponse[0];
            var categories = categoryResponse[0];
            new Contacts('#contacts', {
                contacts: contacts,
                categories: categories
            })
            new Filter('#filter', {
                contacts: contacts,
                categories:categories
            })
        });
    });
})()
