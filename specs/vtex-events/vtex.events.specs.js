(function () {

    describe("vtex.events", function () {
        var $container;

        beforeEach(function() {
            $container = $("<div />").appendTo('body');

            this.addMatchers({
                toHavePushed: function (expected) {
                    if (this.actual.length == 0) {
                        return false;
                    }
                    return this.env.equals_(this.actual[0], expected);
                }
            });

        });

        afterEach(function() {
            $container.remove();

            $('body').off('click');
        });

        describe("when testSubscriber is subscribed", function () {
            afterEach(function () {
                vtex.events.unsubscribe('testSubscriber');
            });

            it("should listen to an event", function () {
                // arrange
                var sentName;
                var sentData;
                vtex.events.subscribe('testSubscriber', function (name, data) {
                    sentName = name;
                    sentData = data;
                });

                // act
                vtex.events.sendEvent('some name', { foo: 'bar', bla: 'ha' });

                // assert
                expect(sentName).toBe('some name');
                expect(sentData.foo).toBe('bar');
                expect(sentData.bla).toBe('ha');
            });
        });

        describe("when window.dataLayer is set", function () {

            beforeEach(function() {
                window.dataLayer = [];

                window.vtex.events.subscribe ('dataLayer', function (name, variables) {
                    variables = variables || {};
                    window.dataLayer = window.dataLayer || [];

                    if (name !== null) {
                        variables['event'] = name;
                    }
                    window.dataLayer.push(variables);
                });
            });

            it("should add an event to an existing element", function () {
                // arrange
                var $targetParent = $('<div />', { 'data-sku': '12345', 'data-quantity': '3' }),
                    $target = $('<button />', { 'data-event': 'addItem' });

                $targetParent.append($target);
                $container.append($targetParent);

                vtex.events.addEvent('addItem', {
                    'sku': eventData('sku').closest,
                    'quantity': eventData('quantity').closest
                });

                // act
                $target.trigger('click');

                // assert
                expect(window.dataLayer).toHavePushed({
                    'event': 'addItem',
                    'sku': '12345',
                    'quantity': '3'
                });
            });

            it("should add an event to an element that will exist", function () {
                // arrange
                vtex.events.addEvent('addItem', {
                    'sku': eventData('sku').closest,
                    'quantity': eventData('quantity').closest
                });

                var $targetParent = $('<div />', { 'data-sku': '12345', 'data-quantity': '3' }),
                    $target = $('<button />', { 'data-event': 'addItem' });

                $targetParent.append($target);
                $container.append($targetParent);

                // act
                $target.trigger('click');

                // assert
                expect(window.dataLayer).toHavePushed({
                    'event': 'addItem',
                    'sku': '12345',
                    'quantity': '3'
                });
            });

            it("should add a custom event to an existing element", function () {
                // arrange
                var $targetParent = $('<div />', { 'data-sku': '12345', 'data-quantity': '3' }),
                    $target = $('<button />', { 'data-event': 'buyItem' });

                $targetParent.append($target);
                $container.append($targetParent);

                vtex.events.addEvent('buyItem', 'aCustomEvent', {
                    'sku': eventData('sku').closest,
                    'quantity': eventData('quantity').closest
                });

                // act
                $target.trigger('aCustomEvent');

                // assert
                expect(window.dataLayer).toHavePushed({
                    'event': 'buyItem',
                    'sku': '12345',
                    'quantity': '3'
                });
            });

            it("should send an event without data", function () {
                // act
                vtex.events.sendEvent('productView');

                // assert
                expect(window.dataLayer).toHavePushed({
                    'event': 'productView'
                });
            });

            it("should send an event containing data", function () {
                // act
                vtex.events.sendEvent('productView', {
                    'pageCategory': 'Product',
                    'visitorId': 12345
                });

                // assert
                expect(window.dataLayer).toHavePushed({
                    'event': 'productView',
                    'pageCategory': 'Product',
                    'visitorId': 12345
                });
            });

            it("should add data", function () {
                // act
                vtex.events.addData({
                    'pageCategory': 'Home',
                    'visitorId': 12345
                });

                // assert
                expect(window.dataLayer).toHavePushed({
                    'pageCategory': 'Home',
                    'visitorId': 12345
                });
            });

        });

        describe("when window.dataLayer is not set", function () {

            beforeEach(function() {
                if (window.dataLayer) {
                    delete window.dataLayer;
                }
            });

            it("should add an event to an existing element", function () {
                // arrange
                var $targetParent = $('<div />', { 'data-sku': '12345', 'data-quantity': '3' }),
                    $target = $('<button />', { 'data-event': 'addItem' });

                $targetParent.append($target);
                $container.append($targetParent);
                
                vtex.events.addEvent('addItem', {
                    'sku': eventData('sku').closest,
                    'quantity': eventData('quantity').closest
                });

                // act
                $target.trigger('click');

                // assert
                expect(window.dataLayer).toHavePushed({
                    'event': 'addItem',
                    'sku': '12345',
                    'quantity': '3'
                });
            });

        });

    });

    describe("when the hash changes", function () {
        var urls;

        var changeHashTo = function (newHash, delay) {
            setTimeout(function () {
                window.location.hash = newHash;
            }, delay || 10);
        };

        var urlsToBeAdded = function (quantity) {
            quantity = quantity || 1;
            return urls.length >= quantity;
        };

        beforeEach(function () {
            urls = [];

            vtex.events.actions.onHashChange(function (newUrl) {
                urls.push(newUrl);
            });
        });

        afterEach(function () {
            $(window).off('hashchange');
            changeHashTo('#');
        });

        it("should fire an action, with the new URL", function () {
            // act
            runs(function () {
                changeHashTo('some-hash');
            });

            // assert
            waitsFor(urlsToBeAdded, "urls to be added", 250);

            runs(function () {
                expect(urls.length).toEqual(1);
                expect(urls[0]).toMatch(/.*#some-hash$/);
            });
        });

        it("should fire only one action for consecutive changes, with the new URL", function () {
            // act
            runs(function () {
                changeHashTo('first-hash');
                changeHashTo('second-hash');
                changeHashTo('last-hash');
            });

            // assert
            waitsFor(urlsToBeAdded, "urls to be added", 250);

            runs(function () {
                expect(urls.length).toEqual(1);
                expect(urls[0]).toMatch(/.*#last-hash$/);
            });
        });

        it("should fire two actions for two distant enough changes, with the new URL", function () {
            // act
            runs(function () {
                changeHashTo('first-hash');
                changeHashTo('second-hash', 200);
            });

            // assert
            waitsFor(function () { return urlsToBeAdded(2); }, "urls to be added", 500);

            runs(function () {
                expect(urls.length).toEqual(2);
                expect(urls[0]).toMatch(/.*#first-hash$/);
                expect(urls[1]).toMatch(/.*#second-hash$/);
            });
        });

    });
})();
