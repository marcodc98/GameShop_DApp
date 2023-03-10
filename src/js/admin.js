AppAdmin = {
    web3Provider: null,
    contracts: {},

    init: async () => {
        return await AppAdmin.initWeb3();        
    },
  
    initWeb3: async function() {
      
      // Modern dapp browsers...
  if (window.ethereum) {
    AppAdmin.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    AppAdmin.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    AppAdmin.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(AppAdmin.web3Provider);
  
  console.log("Sono in initWeb3");
      return await AppAdmin.initContract();
    },
  
    initContract: async function() {
      
    await $.getJSON('GST_Token.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var ProductArtifact = data;
        AppAdmin.contracts.GST_Token = TruffleContract(ProductArtifact);
      
        // Set the provider for our contract
        AppAdmin.contracts.GST_Token.setProvider(AppAdmin.web3Provider);

        reloadBalance();

      });
      
  
      return AppAdmin.bindEvents();
    },


    bindEvents: function() {
        console.log("Sono in bindEvents in adminjs");
        $(document).on('click', '.btn-admin', AppAdmin.handleTransferToken);
        $(document).on('click', '.btn-addProd', AppAdmin.handleAddProduct);
      }, 


    handleTransferToken: function(event) {

        event.preventDefault();
        console.log("Sono nel metodo handletransfer");
    
        var valueAddress = addrInput.value;
        var valueToken = tknInput.value;

        if(valueAddress == "") {
            alert('Inserisci l\'indirizzo');
        }
        else{

          web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
          
            var account = accounts[0];
            

        AppAdmin.contracts.GST_Token.deployed().then(function(instance) {
            contractInstance = instance;
          
            // Execute adopt as a transaction by sending account
            return contractInstance.transfer(valueAddress, valueToken , {from: account});
          }).then(function(result) {
            // return App.markAdopted();
            alert("Trasferimento riuscito!");
            reloadBalance();
    
          }).catch(function(err) {
            alert("Trasferimento non riuscito");
            console.log(err.message);
          });
    });

        }

},

handleAddProduct: function(event) {

  event.preventDefault();
  console.log("Sono in handle addProduct");

  var nameProd = prodNameInput.value;
  var pictureProd = prodPictureInput.value;
  var priceProd = prodPriceInput.value;
  var consoleProd = prodConsoleInput.value;

  if(nameProd == '' || pictureProd == '' || priceProd == '' || consoleProd == '')
  {
    alert("Inserisci tutti i campi!");
  }
  else{

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
      

  AppAdmin.contracts.GST_Token.deployed().then(function(instance) {
      contractInstance = instance;
    
      // Execute adopt as a transaction by sending account
      return contractInstance.addProduct(nameProd, pictureProd, priceProd, consoleProd, {from: account});
    }).then(function(result) {
      // return App.markAdopted();
      alert("Prodotto aggiunto!");
  

    }).catch(function(err) {
      alert("Prodotto non aggiunto!");
      console.log(err.message);
    });
});

  }

}

}

$(function() {
    $(window).load(function() {
        AppAdmin.init();
    });
});

function reloadBalance(){

    var contractInstance;
    var accountBalance = $('#balance');
  
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
  
      AppAdmin.contracts.GST_Token.deployed().then(function(instance) {
        contractInstance = instance;
      
        // Execute adopt as a transaction by sending account
        return contractInstance.balanceOf(account, {from: account});
      }).then(function(result) {
        // return App.markAdopted();

        accountBalance.text(result + " GST");
  
      }).catch(function(err) {
        console.log(err.message);
      });
  
    }); 
  }

