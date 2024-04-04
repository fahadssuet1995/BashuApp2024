import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../config/colors";
import {
  Entypo,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import DropdownAlert from "react-native-dropdownalert";





export default function PrivacyScreen() {
  const navigation = useNavigation();
  const dropdownAlert = useRef();


  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "100%", zIndex: 10000 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>


      <View style={styles.container}>
        <View style={{ marginTop: 70, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name={"arrow-left-circle"} size={35} color={"#DB4437"} />
          </TouchableOpacity>

          <Text style={styles.welcomeText}>Bashu Privacy Policy</Text>
          <Text>Last updated [28 september 2021]</Text>
        </View>




        <ScrollView style={styles.mainContainer}>
          <Text style={styles.termsTexts}>Welcome to Bashu which is provided by Bashu Technologies in Namibia (“we” or “us” or “our”) respects the privacy of our users (“user” or “you”). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our mobile application (the “Application”). Please read this Privacy Policy carefully. IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, PLEASE DO NOT ACCESS THE APPLICATION.</Text>

          <Text style={styles.termsTexts}>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Application after the date such revised Privacy Policy is posted.</Text>

          <Text style={styles.termsTexts}>This Privacy Policy does not apply to the third-party online/mobile store from which you install the Application or make payments, including any in-game virtual items, which may also collect and use data about you. We are not responsible for any of the data collected by any such third party.</Text>

          <Text style={styles.termsTexts}>COLLECTION OF YOUR INFORMATION</Text>

          <Text style={styles.termsTexts}>We may collect information about you in a variety of ways. The information we may collect via the Application depends on the content and materials you use, and includes:</Text>

          <Text style={styles.termsTexts}>Personal Data</Text>

          <Text style={styles.termsTexts}>Demographic and other personally identifiable information (such as your name and email address) that you voluntarily give to us when choosing to participate in various activities related to the Application, such as chat, posting messages in comment sections or in our forums, liking posts, sending feedback, and responding to surveys. If you choose to share data about yourself via your profile, online chat, or other interactive areas of the Application, please be advised that all data you disclose in these areas is public and your data will be accessible to anyone who accesses the Application.</Text>

          <Text style={styles.termsTexts}>Derivative Data</Text>

          <Text style={styles.termsTexts}>Information our servers automatically collect when you access the Application, such as your native actions that are integral to the Application, including liking, re-blogging, or replying to a post, as well as other interactions with the Application and other users via server log files.</Text>

          <Text style={styles.termsTexts}>Financial Data</Text>

          <Text style={styles.termsTexts}>Financial information, such as data related to any payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Application. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor Paypal and you are encouraged to review their privacy policy and contact them directly for responses to your questions.</Text>

          <Text style={styles.termsTexts}>Facebook Permissions The Application may by default access your Facebook basic account information, including your name, email, gender, birthday, current city, and profile picture URL, as well as other information that you choose to make public. We may also request access to other permissions related to your account, such as friends, checkins, and likes, and you may choose to grant or deny us access to each individual permission. For more information regarding Facebook permissions, refer to the Facebook Permissions Reference page.</Text>

          <Text style={styles.termsTexts}>Data from Social Networks</Text>

          <Text style={styles.termsTexts}>User information from social networking sites, such as [Apple’s Game Center, Facebook, Google+ Instagram, Pinterest, Twitter], including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks. This information may also include the contact information of anyone you invite to use and/or join the Application.</Text>

          <Text style={styles.termsTexts}>Geo-Location Information</Text>

          <Text style={styles.termsTexts}>We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using the Application, to provide location-based services. If you wish to change our access or permissions, you may do so in your device’s settings.</Text>

          <Text style={styles.termsTexts}>Mobile Device Access</Text>

          <Text style={styles.termsTexts}>We may request access or permission to certain features from your mobile device, including your mobile device’s bluetooth, calendar, camera, contacts, microphone, reminders, sensors, SMS messages, social media accounts, storage, and other features. If you wish to change our access or permissions, you may do so in your device’s settings.</Text>

          <Text style={styles.termsTexts}>Mobile Device Data</Text>

          <Text style={styles.termsTexts}>Device information such as your mobile device ID number, model, and manufacturer, version of your operating system, phone number, country, location, and any other data you choose to provide.</Text>

          <Text style={styles.termsTexts}>Push Notifications</Text>

          <Text style={styles.termsTexts}>We may request to send you push notifications regarding your account or the Application. If you wish to opt-out from receiving these types of communications, you may turn them off in your device’s settings.</Text>

          <Text style={styles.termsTexts}>Third-Party Data</Text>

          <Text style={styles.termsTexts}>Information from third parties, such as personal information or network friends, if you connect your account to the third party and grant the Application permission to access this information.</Text>

          <Text style={styles.termsTexts}>Data From Contests, Giveaways, and Surveys</Text>

          <Text style={styles.termsTexts}>Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.</Text>

          <Text style={styles.termsTexts}>USE OF YOUR INFORMATION</Text>

          <Text style={styles.termsTexts}>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</Text>

          <Text>1. Administer sweepstakes, promotions, and contests.

            2. Assist law enforcement and respond to subpoena.

            3. Compile anonymous statistical data and analysis for use internally or with third parties.

            4. Create and manage your account.

            5. Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Application to you.

            6. Email you regarding your account or order.

            7. Enable user-to-user communications.

            8. Fulfill and manage purchases, orders, payments, and other transactions related to the Application.

            9. Generate a personal profile about you to make future visits to the Application more personalized.

            10. Increase the efficiency and operation of the Application.

            11. Monitor and analyze usage and trends to improve your experience with the Application.

            12. Notify you of updates to the Application.

            13. Offer new products, services, mobile applications, and/or recommendations to you.

            14. Perform other business activities as needed.

            15. Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.

            16. Process payments and refunds.

            17. Request feedback and contact you about your use of the Application.

            18. Resolve disputes and troubleshoot problems.

            19. Respond to product and customer service requests.

            20. Send you a newsletter.

            21. Solicit support for the Application.

            22. [Other]</Text>

          <Text style={styles.termsTexts}>DISCLOSURE OF YOUR INFORMATION</Text>

          <Text style={styles.termsTexts}>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</Text>

          <Text style={styles.termsTexts}>By Law or to Protect Rights</Text>

          <Text style={styles.termsTexts}>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.</Text>

          <Text style={styles.termsTexts}>Third-Party Service Providers</Text>

          <Text style={styles.termsTexts}>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</Text>

          <Text style={styles.termsTexts}>Marketing Communications</Text>

          <Text style={styles.termsTexts}>With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.</Text>

          <Text style={styles.termsTexts}>Interactions with Other Users</Text>

          <Text style={styles.termsTexts}>If you interact with other users of the Application, those users may see your name, profile photo, and descriptions of your activity, including sending invitations to other users, chatting with other users, liking posts, following blogs.</Text>

          <Text style={styles.termsTexts}>Online Postings</Text>

          <Text style={styles.termsTexts}>When you post comments, contributions or other content to the Applications, your posts may be viewed by all users and may be publicly distributed outside the Application in perpetuity</Text>

          <Text style={styles.termsTexts}>Third-Party Advertisers</Text>

          <Text style={styles.termsTexts}>We may use third-party advertising companies to serve ads when you visit the Application. These companies may use information about your visits to the Application and other websites that are contained in web cookies in order to provide advertisements about goods and services of interest to you.</Text>

          <Text style={styles.termsTexts}>Affiliates</Text>

          <Text style={styles.termsTexts}>We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.</Text>

          <Text style={styles.termsTexts}>Business Partners</Text>

          <Text style={styles.termsTexts}>We may share your information with our business partners to offer you certain products, services or promotions.</Text>

          <Text style={styles.termsTexts}>Offer Wall</Text>

          <Text style={styles.termsTexts}>The Application may display a third-party-hosted “offer wall.” Such an offer wall allows third-party advertisers to offer virtual currency, gifts, or other items to users in return for acceptance and completion of an advertisement offer. Such an offer wall may appear in the Application and be displayed to you based on certain data, such as your geographic area or demographic information. When you click on an offer wall, you will leave the Application. A unique identifier, such as your user ID, will be shared with the offer wall provider in order to prevent fraud and properly credit your account.</Text>

          <Text style={styles.termsTexts}>Social Media Contacts</Text>

          <Text style={styles.termsTexts}>If you connect to the Application through a social network, your contacts on the social network will see your name, profile photo, and descriptions of your activity.</Text>

          <Text style={styles.termsTexts}>Other Third Parties</Text>

          <Text style={styles.termsTexts}>We may share your information with advertisers and investors for the purpose of conducting general business analysis. We may also share your information with such third parties for marketing purposes, as permitted by law.</Text>

          <Text style={styles.termsTexts}>Sale or Bankruptcy</Text>

          <Text style={styles.termsTexts}>If we reorganize or sell all or a portion of our assets, undergo a merger, or are acquired by another entity, we may transfer your information to the successor entity. If we go out of business or enter bankruptcy, your information would be an asset transferred or acquired by a third party. You acknowledge that such transfers may occur and that the transferee may decline honor commitments we made in this Privacy Policy.</Text>

          <Text style={styles.termsTexts}>We are not responsible for the actions of third parties with whom you share personal or sensitive data, and we have no authority to manage or control third-party solicitations. If you no longer wish to receive correspondence, emails or other communications from third parties, you are responsible for contacting the third party directly.</Text>

          <Text style={styles.termsTexts}>TRACKING TECHNOLOGIES</Text>

          <Text style={styles.termsTexts}>Cookies and Web Beacons</Text>

          <Text style={styles.termsTexts}>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Application to help customize the Application and improve your experience. When you access the Application, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Application. You may not decline web beacons. However, they can be rendered ineffective by declining all cookies or by modifying your web browser’s settings to notify you each time a cookie is tendered, permitting you to accept or decline cookies on an individual basis.</Text>

          <Text style={styles.termsTexts}>Internet-Based Advertising</Text>

          <Text style={styles.termsTexts}>Additionally, we may use third-party software to serve ads on the Application, implement email

            marketing campaigns, and manage other interactive marketing initiatives. This third-party software may use cookies or similar tracking technology to help manage and optimize your online experience with us. For more information about opting-out of interest-based ads, visit the Network Advertising Initiative Opt-Out Tool or Digital Advertising Alliance Opt-Out Tool.

            Website Analytics We may also partner with selected third-party vendors[, such as [Adobe Analytics,] [Clicktale,] [Clicky,] [Cloudfare,] [Crazy Egg,] [Flurry Analytics,] [Google Analytics,] [Heap Analytics,] [Inspectlet,] [Kissmetrics,] [Mixpanel,] [Piwik,] and others], to allow tracking technologies and remarketing services on the Application through the use of first party cookies and third-party cookies, to, among other things, analyze and track users’ use of the Application, determine the popularity of certain content, and better understand online activity. By accessing the Application, you consent to the collection and use of your information by these third-party vendors. You are encouraged to review their privacy policy and contact them directly for responses to your questions. We do not transfer personal information to these third-party vendors. However, if you do not want any information to be collected and used by tracking technologies, you can install and/or update your settings for one of the following: [Adobe Privacy Choices Page] [Clicktale Opt-Out Feature] [Crazy Egg Opt-Out Feature] Digital Advertising Alliance Opt-Out Tool [Flurry Analytics Yahoo Opt-Out Manager] [Google Analytics Opt-Out Plugin] [Google Ads Settings Page] [Inspectlet Opt-Out Cookie] [Kissmetrics Opt-Out Feature] [Mixpanel Opt-Out Cookie] Network Advertising Initiative Opt-Out Tool

            You should be aware that getting a new computer, installing a new browser, upgrading an existing browser, or erasing or otherwise altering your browser’s cookies files may also clear certain opt-out cookies, plug-ins, or settings.</Text>

          <Text style={styles.termsTexts}>THIRD-PARTY WEBSITES</Text>

          <Text style={styles.termsTexts}>The Application may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Application, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information. We are not responsible for the content or privacy and security practices and policies of any third parties,

            including other sites, services or applications that may be linked to or from the Application.</Text>

          <Text style={styles.termsTexts}>SECURITY OF YOUR INFORMATION</Text>

          <Text style={styles.termsTexts}>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.</Text>

          <Text style={styles.termsTexts}>POLICY FOR CHILDREN</Text>

          <Text style={styles.termsTexts}>We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.</Text>

          <Text style={styles.termsTexts}>CONTROLS FOR DO-NOT-TRACK FEATURES</Text>

          <Text style={styles.termsTexts}>Most web browsers and some mobile operating systems [and our mobile applications] include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Policy.</Text>

          <Text style={styles.termsTexts}>OPTIONS REGARDING YOUR INFORMATION</Text>

          <Text style={styles.termsTexts}>Account Information</Text>

          <Text style={styles.termsTexts}>You may at any time review or change the information in your account or terminate your account by:</Text>

          <Text>● Logging into your account settings and updating your account

            ● Contacting us using the contact information provided below

            ● Logging into your account settings and terminating your account.

            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.]

            Emails and Communications

            If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:

            ● Noting your preferences at the time you register your account with the Application

            ● Logging into your account settings and updating your preferences.

            ● Contacting us using the contact information provided below
          </Text>
          <Text style={styles.termsTexts}>If you no longer wish to receive correspondence, emails, or other communications from third parties, you are responsible for contacting the third party directly.</Text>

          <Text style={styles.termsTexts}>CONTACT US</Text>

          <Text style={styles.termsTexts}>If you have questions or comments about this Privacy Policy, please contact us at:</Text>

          <Text>[BASHU TECHNOLOGIES (PTY) LTD]

            [Erf 923, CIMBEBACIA]

            [WINDHOEK, NAMIBIA]

            [+264 813334804]

            [bashuapp@gmail.com]</Text>

          <Text style={styles.termsTexts}>You agree that by accessing the App, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the App and you must discontinue use immediately.</Text>

          <Text style={styles.termsTexts}>Supplemental terms and conditions or documents that may be posted on the App from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason.</Text>

          <Text style={styles.termsTexts}>We will alert you about any changes by updating the “Last updated” date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.</Text>
        </ScrollView>

        <View style={styles.orContainer}>
          <View style={{ width: 120, backgroundColor: "black", height: 1 }} />
          <Text style={{ margin: 5 }}>OR</Text>
          <View style={{ width: 120, backgroundColor: "black", height: 1 }} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Entypo
              name={"facebook-with-circle"}
              size={50}
              color={"#3b5998"}
            />
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <TouchableOpacity>
            <Entypo
              name={"google--with-circle"}
              size={50}
              color={"#DB4437"}
            />
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <TouchableOpacity
            style={{
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 50,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntDesign name={"apple1"} size={30} color={"black"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  mainContainer: {
    padding: 15
  }, noticeContainer: {
    borderBottomColor: "#F5FCFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 20,
    padding: 10,
  },
  termsTexts: {
    marginBottom: 20,
    fontSize: 15
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
    top: 3,
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
  },
  forgotButtonContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
    width: 250,
    color: "black",
    backgroundColor: "red",
  },
  loginButton: {
    backgroundColor: colors.primary,
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    display: "none",
  },
  orContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    display: "none",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    alignItems: "center",
  },
  back: {
    top: 20,
    left: 10,
  },
});
