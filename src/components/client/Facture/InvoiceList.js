import React, { useState, useEffect } from 'react';
import Visto from '../../../images/Visto.png';
import Header from '../HeaderClient';
import axios from 'axios';
import {  Table,Typography, Button,Space ,Modal ,Spin, Alert  } from 'antd';
import { EyeOutlined,DownloadOutlined} from '@ant-design/icons';

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
const { Title } = Typography;
const InvoiceList = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [selectedFacture, setSelectedFacture] = useState(null);
    const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
    const styles = StyleSheet.create({
      page: {
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 20,
      },
      section: {
        marginBottom: 20,
        padding: 10,
      },
      Visto: {
        marginBottom: 10,
        width: "20%",
      },
    //    Visto: {
    //   width: 50, // Largeur de l'image réduite
    //   height: 50, // Hauteur de l'image réduite
    //   marginBottom: 10,
    // },
      title: {
        fontSize: 20,
        color: "#14149f",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginLeft: "auto",
        marginRight: "auto",
        textDecoration: "underline",
        paddingBottom: 4,
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 11,
        color: "#1b1b1b",
        fontWeight: "normal",
        marginBottom: 8,
      },
      table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderRightWidth: 0,
        borderBottomWidth: 0,
      },
      tableRow: {
        flexDirection: "row",
      },
      tableColHeaderDesignation: {
        width: "40%", // Largeur plus grande pour la colonne "Designation"
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#6696bd",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#84bdea",
      },
      tableColDesignation: {
        width: "40%", // Largeur correspondante pour les cellules de "Designation"
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderLeftWidth: 0,
        borderTopWidth: 0,
      },
      tableColHeader: {
        width: "15%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#6696bd",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#84bdea",
      },
      tableCol: {
        width: "15%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderLeftWidth: 0,
        borderTopWidth: 0,
      },
      tableCellHeader: {
        margin: 5,
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
      },
      tableCell: {
        margin: 5,
        fontSize: 10,
        textAlign: "center",
      },
  
      totalsContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 10,
        justifyContent: "space-between",
      },
      totalsLeft: {
        width: "40%",
        marginRight: 10,
        textAlign: "right",
      },
      totalsRight: {
        width: "40%",
        marginLeft: 10,
      },
      totalsText: {
        fontSize: 10,
        marginBottom: 5,
        color: "#333",
      },
      totalsValue: {
        fontSize: 12,
        marginBottom: 5,
        color: "#555",
      },
      totalsTable: {
        marginLeft: 50,
        width: "80%",
  
        borderStyle: "solid",
      },
      totalsTableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
      },
      totalsTableCell: {
        flex: 1,
  
        textAlign: "center",
        borderRightWidth: 1,
        borderColor: "#ccc",
      },
      totalsTableCellHeader: {
        flex: 1,
  
        textAlign: "center",
        borderRightWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#84bdea", // Couleur de fond pour les en-têtes de colonnes
        fontWeight: "bold", // Gras pour les en-têtes
      },
      totalsLastCell: {
        borderRightWidth: 0,
      },
  
      footerContainer: {
        textAlign: "center",
        borderTop: "2px solid #ddd",
        paddingTop: 10,
        marginTop:130,
        fontSize: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      footerText: {
        fontSize: 11.5,
      },
    });
  
    const showPrintModal = (record) => {
      setSelectedFacture(record); // Sélectionnez la facture pour l'impression
      setIsPrintModalVisible(true);
    };
    const handlePrintModalCancel = () => {
      setIsPrintModalVisible(false);
    };
  
    const showShowModal = (record) => {
        setIsShowModalVisible(true);
        setSelectedFacture(record);
      
      };
        const handleShowModalCancel = () => {
        setIsShowModalVisible(false);
      };
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('Access token not found');
                }
                const response = await axios.get('http://localhost:5000/auth/profile/Client', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUserProfile(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
                setError('Erreur lors de la récupération du profil utilisateur.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const columns = [
        {
            title: 'Numéro de Facture',
            dataIndex: 'Num_Fact',
            key: 'Num_Fact',
        },
        {
            title: 'Date de Facture',
            dataIndex: 'Date_Fact',
            key: 'Date_Fact',
            render: date => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Services',
            dataIndex: 'services',
            key: 'services',
            render: services => (
                <ul>
                    {services.map(service => (
                        <li key={service._id}>
                            {service.libelle} ({service.quantite} {service.unite}) - {service.montant_HT_Apres_Remise} 
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Total TTC',
            dataIndex: 'total_TTC',
            key: 'total_TTC',
        },
      
        {
            title: 'Devise',
            dataIndex: 'devise',
            key: 'devise',
            render: devise => devise ? `${devise.Nom_D} (${devise.Symbole})` : '',
        },
        {
            title: 'Actions',
            render: (_, record) => (
              <Space style={{ float: 'left' }}>
                <Button type="link" icon={<EyeOutlined />} onClick={() => showShowModal(record)} />
               
        <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => showPrintModal(record)} // Passer le record à la fonction
          ></Button>
              </Space>
            ),
          },
    ];
    const columnsShow = [
        {
          title: 'Ref',
          dataIndex: 'reference',
          key: 'reference',
          width: '140px',
        },
        
        {
          title: 'Designation',
          dataIndex: 'libelle',
          key: 'libelle',
        
        },
         {
          title: 'Unite',
          dataIndex: 'unite',
          key: 'unite',
          width: '100px',
        },
        {
          title: 'Qté',
          dataIndex: 'quantite',
          key: 'quantite',
          width: '80px',
        },
        {
          title: 'PU',
          dataIndex: 'prix_unitaire',
          key: 'prix_unitaire',
          width: '120px',
        },
      
       
        {
          title: 'Montant HT',
          dataIndex: 'montant_HT',
          key: 'montant_HT',
          width: '150px',
        },
      ];
    
    if (loading) {
        return <Spin tip="Chargement..." />;
    }

    if (error) {
        return <Alert message="Erreur" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Header />
            <div style={{marginRight:'65px' , marginLeft:'70px'}}>
            <h1>Invoices</h1>
            {userProfile && userProfile.facture.length > 0 ? (
                <Table
                    dataSource={userProfile.facture}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                />
            ) : (
                <p>No invoices available.</p>
            )}
            </div>
            <Modal
            visible={isPrintModalVisible}
            onCancel={handlePrintModalCancel}
            footer={
              <PDFDownloadLink
                document={
                  <Document>
                    <Page size="A4" style={styles.page}>
                      <View style={styles.section}>
                        <Image src={Visto} style={styles.Visto} />
                        <Text style={styles.title}>
                          {selectedFacture
                            ? selectedFacture.Num_Fact
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          Date:{" "}
                          {selectedFacture
                            ? formatDate(selectedFacture.Date_Fact)
                            : "-"}
                        </Text>

                        <Text style={styles.subtitle}>
                          Tax ID:{" "}
                          {selectedFacture && selectedFacture.parametre
                            ? selectedFacture.parametre.Matricule_Fiscale_S
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                        Company name :{" "}
  {selectedFacture && selectedFacture.parametre
    ? selectedFacture.parametre.Nom_S
    : "-"}
</Text>

                        <Text style={styles.subtitle}>
                          Phone:{" "}
                          {selectedFacture && selectedFacture.parametre
                            ? selectedFacture.parametre.Num_Phone_S
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          {selectedFacture && selectedFacture.parametre
                            ? `${selectedFacture.parametre.Address_S}, ${selectedFacture.parametre.Paye_S}, ${selectedFacture.parametre.Code_Postal_S}`
                            : "-"}
                        </Text>
                      </View>
                      {/* Informations du client à droite */}
                      <View style={styles.section}>
                        <View style={{ marginTop: -70, marginLeft: 375 }}>
                          {selectedFacture &&
                            selectedFacture.client &&
                            selectedFacture.client.matricule_fiscale && (
                              <Text style={styles.subtitle}>
                                Tax ID:{" "}
                                {selectedFacture.client.matricule_fiscale}
                              </Text>
                            )}
                          <Text style={styles.subtitle}>
                            Client:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.fullname
                              : "-"}
                          </Text>
                          <Text style={styles.subtitle}>
  Country: {" "}
  {selectedFacture && selectedFacture.client
    ? selectedFacture.client.country
    : "-"}
</Text>

                          <Text style={styles.subtitle}>
                            Email:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.email
                              : "-"}
                          </Text>
                          <Text style={styles.subtitle}>
                            Phone:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.num_phone
                              : "-"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.table}>
                        <View style={styles.tableRow}>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                             Ref
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderDesignation}> {/* Utilisation du nouveau style pour "Designation" */}
      <Text style={styles.tableCellHeader}>
        Designation
      </Text>
    </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Unit</Text>
                          </View>
                        
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Quantity</Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                             PU
                            </Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                            Discount(%)
                            </Text>
                          </View>
                          {/* <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>TVA</Text>
                          </View> */}
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                            Net Amount
                            </Text>
                          </View>
                        </View>
                        {selectedFacture &&
                        selectedFacture.services &&
                        Array.isArray(selectedFacture.services) &&
                        selectedFacture.services.length > 0 ? (
                          selectedFacture.services.map((service, index) => (
                            <View style={styles.tableRow} key={index}>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.reference}
                                </Text>
                              </View>
                              <View style={styles.tableColDesignation}>
                                <Text style={styles.tableCell}>
                                  {service.libelle}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.unite}
                                </Text>
                              </View>
                       
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.quantite}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.prix_unitaire}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.remise}%
                                </Text>
                              </View>
                                     {/* <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.tva}%
                                </Text>
                              </View> */}
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.montant_HT}
                                </Text>
                              </View>
                            </View>
                          ))
                        ) : (
                          <View style={styles.tableRow}>
                            <View style={styles.tableCol} colSpan={7}>
                              <Text style={styles.tableCell}>
                              No service found
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>

                      <View style={styles.totalsContainer}>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.totalsText}>
                          Invoice totalled to" ou "Invoice amounted to{" "}
                          </Text>
                          <Text style={styles.totalsText}>
                            {selectedFacture
                              ? selectedFacture.total_TTC_Lettre
                              : "-"}
                          </Text>
                        </View>
                        <View style={styles.totalsRight}>
                          <View style={styles.totalsTable}>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total HT
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_HT !== undefined
                                    ? selectedFacture.total_HT.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                Discount
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_Remise !== undefined
                                    ? selectedFacture.total_Remise.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                Net total after Discount
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_HT_Apres_Remise !== undefined
                                    ? selectedFacture.total_HT_Apres_Remise.toFixed(
                                        3
                                      )
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total TVA
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_TVA !== undefined
                                    ? selectedFacture.total_TVA.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                Fiscal Stamp
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture  && selectedFacture.timbre.Valeur !== undefined
                                    ? selectedFacture.timbre.Valeur.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total TTC
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture  && selectedFacture.total_TTC !== undefined
                                    ? selectedFacture.total_TTC.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>
                         Phone:{" "}
                          {selectedFacture
                            ? selectedFacture.parametre.Num_Phone_S
                            : "-"}{" "}
                          | Email:{" "}
                          {selectedFacture
                            ? selectedFacture.parametre.email
                            : "-"}{" "}
                          |Address:{" "}
                          {selectedFacture
                            ? `${selectedFacture.parametre.Address_S}, ${selectedFacture.parametre.Paye_S}, ${selectedFacture.parametre.Code_Postal_S}`
                            : "-"}
                        </Text>
                      </View>
                    </Page>
                  </Document>
                }
                fileName="facture.pdf"
              >
                {({ loading }) =>
                  loading ? "Chargement..." : "Download PDF"
                }
              </PDFDownloadLink>
            }
            width={800}
          >
            <div
              style={{
                textAlign: "center",
                margin: "20px auto",
                maxWidth: "600px",
              }}
            >
              {selectedFacture && (
                <>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Invoice number : {selectedFacture.Num_Fact}
                  </p>
                  {/* Ajoutez d'autres détails de la facture ici si nécessaire */}
                  <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                  Click the button below to download your invoice in PDF format:
                  </p>
                  {/* Ajoutez votre bouton de téléchargement ici */}
                </>
              )}
            </div>
          </Modal>
            <Modal
  width={1000}
  visible={isShowModalVisible}
  footer={
    <div style={{ textAlign: "left", padding: "10px 0" }}>
      <p style={{ fontWeight: 'bold' }}>Close this invoice at the amount of: {selectedFacture && selectedFacture.total_TTC_Lettre} {selectedFacture && selectedFacture.devise && selectedFacture.devise.Nom_D}</p>

      {/* Bouton de téléchargement */}
      

    </div>
  }
  onCancel={() => handleShowModalCancel(false)}
>


  {/* Header with image */}
  <div style={{ marginBottom: "20px", textAlign: "left" }}>
    <img src={Visto} alt="logo" style={{ width: "150px" }} />
  </div>

  {/* Invoice details */}
  {selectedFacture && (
    <>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={3} style={{ fontWeight: 'bold' }}>Invoice N° : {selectedFacture.Num_Fact}</Title>
        <p><span style={{ fontWeight: 'bold' }}>Date:</span> {formatDate(selectedFacture.Date_Fact)}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '10px', marginTop: '-90px' }}>
          <p>{selectedFacture.parametre.Nom_S}</p>
          <p>{selectedFacture.parametre.Address_S}</p>
          <p>{selectedFacture.parametre.Paye_S}</p>
          <p>{selectedFacture.parametre.Num_Phone_S}</p>
          <p>{selectedFacture.parametre.Matricule_Fiscale_S}</p>
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <p><span style={{ fontWeight: 'bold' }}>Client : </span>{selectedFacture.client.fullname}</p>
          <p><span style={{ fontWeight: 'bold' }}>TIN :</span> {selectedFacture.client.matricule_fiscale || 'N/A'}</p>
          <p><span style={{ fontWeight: 'bold' }}>Address :</span> {selectedFacture.client.address}</p>
          <p><span style={{ fontWeight: 'bold' }}>Num Phone :</span> {selectedFacture.client.num_phone}</p>
        </div>
      </div>

      <Table columns={columnsShow} dataSource={selectedFacture.services} pagination={false} />

      <div style={{ textAlign: "right", marginTop: "0px" }}>
        <p><span style={{ fontWeight: 'bold' }}>Total HT: </span>{selectedFacture.total_HT}</p>

        <p><span style={{ fontWeight: 'bold' }}>Total Remise :</span> {selectedFacture.total_Remise}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total Net HT :</span> {selectedFacture.total_HT_Apres_Remise}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total TVA :</span> {selectedFacture.total_TVA}</p>
        <p><span style={{ fontWeight: 'bold' }}>Stamp :</span> {selectedFacture.timbre.Valeur}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total TTC :</span> {selectedFacture.total_TTC}</p>
      </div>
    </>
  )}
</Modal>

        </div>
    );
};

export default InvoiceList;
