
def _get_receipt_header():
    return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Receipt</title>
        </head>
        <body>
            <div id="invoice-POS">
                <center id="top">
                    <div class="info"> 
                        <h2>CreateYourOwnBurger</h2>
                    </div>
                </center>

                <div id="mid">
                    <div class="info">
                        <h2>Contact information</h2>
                        <p> 
                            Email: surik4t@yandex.ru </br>
                            t.me: @Surik4t </br>
                            github.com/Surik4t
                        </p>
                    </div>
                </div>
    """


def _get_receipt_body(order):
    table_header = """
        <div id="bot">
            <div id="table">
                <table>
                    <tr class="tabletitle">
                        <td class="item"><h2>Product</h2></td>
                        <td class="qty"><h2>Qty</h2></td>
                        <td class="price"><h2>Price</h2></td>
                    </tr>
    """

    def combine_ingredients(burger: dict):
        ingr_counter = dict()
        for ingr in burger["ingredients"]:
            ingr_counter.setdefault(ingr["name"], [0, 0])
            ingr_counter[ingr["name"]][0] += 1
            ingr_counter[ingr["name"]][1] += ingr["price"]

        return ingr_counter
    
    table_body = ""
    for burger in order["content"]:
        table_body += f"""
            <tr class="service burger-name">
                <td class="tableitem" colspan="3"><p class="itemtext">{burger["name"]}</p></td>
            </tr>
        """
        for ingr, (qty, price)  in combine_ingredients(burger).items():
            table_body += f"""
                <tr class="service ingredient-row">
                    <td class="tableitem ingredient"><p class="itemtext">{ingr}</p></td>
                    <td class="tableitem qty"><p class="itemtext">{qty}</p></td>
                    <td class="tableitem price"><p class="itemtext">${price}</p></td>
                </tr>
            """

    table_body += f"""
        <tr class="service total-row">
            <td class="tableitem ingredient"><p class="itemtext">Burger price:</p></td>
            <td class="tableitem qty"><p class="itemtext">-</p></td>
            <td class="tableitem price"><p class="itemtext">${burger["price"]}</p></td>
        </tr>
    """

    table_footer = f"""
                    <tr class="tabletitle">
                        <td></td>
                        <td class="qty"><h2>Total</h2></td>
                        <td class="price"><h2>${order["price"]}</h2></td>
                    </tr>
                </table>
            </div>
    """

    return table_header + table_body + table_footer


def _get_receipt_footer():
    return """
                <div id="legalcopy">
                    <p class="legal"><strong>Thanks for ordering!</strong> Thank you for your time and I hope you liked my app.</p>
                    <p class="legal"> <a href="https://github.com/Surik4t/CreateYourOwnBurger" target="_blank">Application source code - CreateYourOwnBurger</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """


def _get_styles():
    return """
        <style>
            #invoice-POS {
                box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
                padding: 2mm;
                margin: 0 auto;
                width: 110mm;
                background: #FFF;
                font-family: Arial, sans-serif;
            }

            ::selection {background: #f31544; color: #FFF;}
            ::-moz-selection {background: #f31544; color: #FFF;}

            h1 {
                font-size: 1.5em;
                color: #222;
            }

            h2 {
                font-size: 1em;
            }

            p {
                font-size: 0.7em;
                color: #666;
                line-height: 1.2em;
            }

            #top, #mid, #bot {
                border-bottom: 1px solid #EEE;
            }

            #top {
                min-height: 100px;
            }

            #mid {
                min-height: 80px;
            }

            #bot {
                min-height: 50px;
            }

            .title {
                float: right;
            }

            .title p {
                text-align: right;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            .tabletitle {
                padding: 5px;
                font-size: 0.8em;
                background: #EEE;
            }

            .service {
                border-bottom: 1px solid #EEE;
            }

            .product {
                width: 40mm;
            }

            .qty {
                width: 15mm;
            }

            .price {
                width: 0mm;
            }

            .ingredient-row {
                font-size: 1em;
                color: #888;
            }

            .burger-name {
                font-weight: bold;
                font-size: 1em;
                background-color: #f9f9f9;
            }

            #legalcopy {
                margin-top: 5mm;
            }

            .total-row {
                font-weight: bold;
            }
        </style>
        """


def create_receipt(order):
    return _get_receipt_header() + _get_styles() + _get_receipt_body(order) + _get_receipt_footer()

